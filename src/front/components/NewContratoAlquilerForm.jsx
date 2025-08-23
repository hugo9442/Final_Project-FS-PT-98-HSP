import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { PDFDocument, rgb } from "pdf-lib";
import ModalAnexos from "./ModalAnexos.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Urlexport } from "../urls.js";
import { taxholding } from "../fecht_taxholding.js";
import { tax } from "../fecht_tax.js";

const A4_WIDTH = 595.28; // puntos
const A4_HEIGHT = 841.89; // puntos
const MARGIN = 20; // margen en pts

const ModalContrato = ({ visible, dataApartment }) => {
  if (!dataApartment) return null;

  const contratoRef = useRef();
  const [anexos, setAnexos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false); // NUEVO para spinner DocuSign
  const [contractBlob, setContractBlob] = useState(null);
  const [taxTypeId, setTaxTypeId] = useState(null);
  const [withholdingId, setWithholdingId] = useState(null);
  const [taxTypes, setTaxTypes] = useState([]);
  const [withholdings, setWithholdings] = useState([]);

  const fetchData = async () => {
    try {
      const data = await tax.gettaxt(store.token);
      setTaxTypes(data);
    } catch (error) { }
    try {
      const data = await taxholding.getholding(store.token);
      setWithholdings(data);
    } catch (error) { }
  };

  useEffect(() => {
    fetchData();
  }, [store.token]);

  const [data, setData] = useState({
    fecha: "",
    apartment_id: dataApartment.apartment_id,
    inmuebleDireccion: dataApartment.direccion,
    ciudad: dataApartment.ciudad,
    postal_code: dataApartment.postal_code,
    parking_slot: dataApartment.parking_slot,
    type: dataApartment.type,
    arrendadorNombre: dataApartment.owner_name,
    owner_last_name: dataApartment.owner_last_name,
    owner_email: dataApartment.owner_email,
    owner_phone: dataApartment.owner_phone,
    owner_id: dataApartment.owner_id,
    arrendadorDNI: dataApartment.owner_national_id,
    arrendadorDireccion: "",
    arrendatarioNombre: "",
    arrendatarioDNI: "",
    arrendatarioDireccion: "",
    arrendatarioEmail: "",
    arrendatarioTelefono: "",
    cuentaBancaria: "",
    observaciones: "",
    fianza: "",
    duracion: "",
    fechaInicio: "",
    fechaFin: "",
    iva: "",
    retencion: withholdingId,
    renta: "",
    tipoVivienda: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  async function addImagesGrid(pdfDoc, images) {
    const imagesPerPage = 6;
    const cols = 2;
    const rows = 3;

    const usableWidth = A4_WIDTH - 2 * MARGIN;
    const usableHeight = A4_HEIGHT - 2 * MARGIN;

    const cellWidth = usableWidth / cols;
    const cellHeight = usableHeight / rows;

    for (let i = 0; i < images.length; i += imagesPerPage) {
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

      const pageImages = images.slice(i, i + imagesPerPage);
      const numImages = pageImages.length;

      const rowsUsed = numImages <= cols ? 1 : Math.ceil(numImages / cols);
      const adjustedCellHeight = usableHeight / rowsUsed;

      for (let idx = 0; idx < numImages; idx++) {
        const img = pageImages[idx];
        let embeddedImage;
        if (img.type === "image/jpeg" || img.type === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(await img.arrayBuffer());
        } else if (img.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(await img.arrayBuffer());
        } else {
          continue;
        }

        const col = idx % cols;
        const row = Math.floor(idx / cols);

        const x = MARGIN + col * cellWidth;
        const y = A4_HEIGHT - MARGIN - (row + 1) * adjustedCellHeight;

        const { width: imgWidth, height: imgHeight } = embeddedImage.size();
        const scale = Math.min(cellWidth / imgWidth, adjustedCellHeight / imgHeight);

        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        const xOffset = x + (cellWidth - drawWidth) / 2;
        const yOffset = y + (adjustedCellHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x: xOffset,
          y: yOffset,
          width: drawWidth,
          height: drawHeight,
        });
      }
    }
  }

  const handleSubmit = async () => {
    if (!contratoRef.current) {
      alert("El contrato aún no está listo. Vuelve a intentarlo en un segundo.");
      return;
    }
    setIsGenerating(true);
    try {
      const inputs = Array.from(contratoRef.current.querySelectorAll("input"));
      const originalValues = inputs.map((input) => ({
        input,
        parent: input.parentNode,
        originalNode: input.cloneNode(true),
      }));

      originalValues.forEach(({ input, parent }) => {
        const span = document.createElement("span");
        span.textContent = input.value || "________";
        span.style.borderBottom = "1px solid black";
        span.style.padding = "2px 4px";
        span.style.margin = "0 4px";
        span.style.fontWeight = "bold";

        parent.replaceChild(span, input);
      });

      const contratoBlob = await html2pdf()
        .from(contratoRef.current)
        .set({
          margin: 0.5,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .outputPdf("blob");

      originalValues.forEach(({ originalNode, parent }) => {
        const span = parent.querySelector("span");
        if (span) {
          parent.replaceChild(originalNode, span);
        }
      });

      const contratoPdfDoc = await PDFDocument.load(await contratoBlob.arrayBuffer());

      const imagenes = anexos.filter((f) => f.type.startsWith("image/"));
      const pdfs = anexos.filter((f) => f.type === "application/pdf");

      for (const file of pdfs) {
        const pdfBytes = await file.arrayBuffer();
        const pdfToAppend = await PDFDocument.load(pdfBytes);
        const pages = await contratoPdfDoc.copyPages(pdfToAppend, pdfToAppend.getPageIndices());
        pages.forEach((page) => contratoPdfDoc.addPage(page));
      }

      if (imagenes.length > 0) {
        await addImagesGrid(contratoPdfDoc, imagenes);
      }

      const pdfBytes = await contratoPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Contrato_Alquiler_Con_Anexos.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setContractBlob(blob);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputStyle = {
    border: "none",
    borderBottom: "1px solid black",
    minWidth: "100px",
    padding: "2px 4px",
    fontWeight: "bold",
    fontSize: "1em",
    outline: "none",
  };

  const handleDocuSignSend = async () => {
    if (!contractBlob) {
      alert("Primero debes generar el contrato PDF.");
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append("contract", contractBlob, "Contrato_Alquiler_Con_Anexos.pdf");

    formData.append("tenant_name", data.arrendatarioNombre);
    formData.append("tenant_email", data.arrendatarioEmail);
    formData.append("tenant_dni", data.arrendatarioDNI);
    formData.append("tenant_phone", data.arrendatarioTelefono);
    formData.append("account_number", data.cuentaBancaria);
    formData.append("apartment_id", dataApartment.apartment_id);
    formData.append("landlord_name", `${dataApartment.owner_name} ${dataApartment.owner_last_name}`);
    formData.append("landlord_email", dataApartment.owner_email);
    formData.append("owner_id", dataApartment.owner_id);
    formData.append("renta", data.renta);
    formData.append("iva", taxTypeId);
    formData.append("retencion", withholdingId);
    formData.append("start_date", data.fechaInicio);
    formData.append("end_date", data.fechaFin);

    try {
      const response = await fetch(`${Urlexport}/docusing/send_contract`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Contrato enviado a DocuSign correctamente.");
      } else {
        const error = await response.json();
        console.error(error);
        alert("Error al enviar a DocuSign.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al enviar a DocuSign.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        maxWidth: 800,
        position: !visible ? "absolute" : "relative",
        top: !visible ? "-9999px" : "auto",
        left: !visible ? "-9999px" : "auto",
        opacity: !visible ? 0 : 1,
        pointerEvents: !visible ? "none" : "auto",
      }}
    >
      {/* Spinner overlay */}
      {isSending && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.8)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            color: "#333",
          }}
        >
          <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Enviando contrato a DocuSign, por favor espera...</p>
        </div>
      )}

      <div
        ref={contratoRef}
        className="p-5 border bg-white"
        style={{ lineHeight: 1.6, fontSize: "1rem", color: "#222", textAlign: "justify" }}
      >
        <h2 className="text-center mb-4" style={{ textTransform: "uppercase" }}>
          Contrato de Arrendamiento de Vivienda
        </h2>

        <p>
          En la ciudad de <strong>{dataApartment.ciudad}</strong>, a fecha de{" "}
          <input name="fecha" type="date" value={data.fecha} onChange={handleChange} style={inputStyle} required />
          .
        </p>

        <h4 className="mt-4">REUNIDOS</h4>
        <p>
          De una parte, D./D.ª <strong>{dataApartment.owner_name}</strong>, mayor de edad, con domicilio en{" "}
          <strong>{dataApartment.direccion}</strong>, Código Postal <strong>{dataApartment.postal_code}</strong>, en adelante
          denominado/a "EL ARRENDADOR".
        </p>
        <p>
          Y de otra parte, D./D.ª{" "}
          <input
            name="arrendatarioNombre"
            value={data.arrendatarioNombre}
            onChange={handleChange}
            placeholder="Nombre arrendatario"
            style={inputStyle}
            required
          />
          , con domicilio en{" "}
          <input
            name="arrendatarioDireccion"
            value={data.arrendatarioDireccion}
            onChange={handleChange}
            placeholder="Dirección arrendatario"
            style={inputStyle}
            required
          />
          , provisto/a de DNI nº{" "}
          <input
            name="arrendatarioDNI"
            value={data.arrendatarioDNI}
            onChange={handleChange}
            placeholder="DNI arrendatario"
            style={inputStyle}
            required
          />
          , con email{" "}
          <input
            name="arrendatarioEmail"
            value={data.arrendatarioEmail}
            onChange={handleChange}
            placeholder="Email arrendatario"
            style={inputStyle}
            required
          />{" "}
          y teléfono{" "}
          <input
            name="arrendatarioTelefono"
            value={data.arrendatarioTelefono}
            onChange={handleChange}
            placeholder="Teléfono arrendatario"
            style={inputStyle}
            required
          />
          , en adelante denominado/a "EL ARRENDATARIO".
        </p>

        <h4 className="mt-4">EXPONEN</h4>
        <p>
          I. Que EL ARRENDADOR es propietario de una propiedad tipo,
          <select
            name="tipoVivienda"
            value={data.tipoVivienda}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value=""></option>
            <option value="VIVIENDA">VIVIENDA</option>
            <option value="BAJO">LOCAL COMERCIAL</option>
            <option value="TRASTERO">TRASTERO</option>
            <option value="ALMACEN">ALMACEN</option>
          </select>{" "}
          situada en <strong>{dataApartment.direccion}</strong>, <strong>{dataApartment.ciudad}</strong>, Código Postal{" "}
          <strong>{dataApartment.postal_code}</strong>, incluyendo{" "}
          {dataApartment.parking_slot ? `una plaza de parking ${dataApartment.parking_slot}` : "sin plaza de parking"}.
        </p>

        <h4 className="mt-4">CLÁUSULAS</h4>

        <p>
          <strong>Primera. Objeto del contrato:</strong> El ARRENDADOR cede en arrendamiento al ARRENDATARIO el inmueble arriba
          descrito, destinado exclusivamente a vivienda habitual.
        </p>

        <p>
          <strong>Segunda. Duración:</strong> La duración del presente contrato será de{" "}
          <input
            name="duracion"
            value={data.duracion}
            onChange={handleChange}
            placeholder="Ej: 1 año"
            style={inputStyle}
            required
          />
          , comenzando el{" "}
          <input name="fechaInicio" type="date" value={data.fechaInicio} onChange={handleChange} style={inputStyle} required /> y
          terminando el{" "}
          <input name="fechaFin" type="date" value={data.fechaFin} onChange={handleChange} style={inputStyle} required /> . El
          contrato podrá prorrogarse conforme a la legislación vigente.
        </p>

        <p>
          <strong>Tercera. Renta:</strong> La renta mensual pactada asciende a{" "}
          <input
            name="renta"
            value={data.renta}
            onChange={handleChange}
            placeholder="Ej: 600"
            style={inputStyle}
            required
          />{" "}
          €, a abonar dentro de los primeros cinco días de cada mes. La cuenta bancaria designada es:{" "}
          <input
            name="cuentaBancaria"
            value={data.cuentaBancaria}
            onChange={handleChange}
            placeholder="ESXX XXXX XXXX XXXX XXXX"
            style={inputStyle}
            required
          />
          .
        </p>
        <p>
          <strong>Cuarta. IVA y Retenciones: </strong>
          En el presente contrato, se acuerda que: <br />
          - Para propiedades clasificadas como <strong>VIVIENDA</strong>, no se aplicará IVA ni retención, conforme a lo establecido
          en la normativa fiscal vigente. <br />
          - Para el resto de propiedades (LOCAL COMERCIAL, TRASTERO, ALMACÉN u otras), se aplicará el IVA y la retención
          correspondientes según la legislación aplicable, calculados sobre la base imponible de la renta pactada. <br />
        </p>
        <p>
          <strong>IVA: </strong>
          <select
            name="iva"
            value={data.iva}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setTaxTypeId(value);
              setData((prev) => ({ ...prev, iva: value }));
            }}
            style={inputStyle}
            required
          >
            <option value="">Selecciona IVA</option>
            {taxTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.percentage}%)
              </option>
            ))}
          </select>{" "}
          <br />
          <strong> Retencion:</strong>
          <select
            name="retencion"
            value={data.retencion}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setWithholdingId(value);
              setData((prev) => ({ ...prev, retencion: value }));
            }}
            style={inputStyle}
            required
          >
            <option value="">Selecciona retención</option>
            {withholdings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.percentage}%)
              </option>
            ))}
          </select>
        </p>

        <p>
          <strong>Quinta. Fianza:</strong> Se entrega una fianza de{" "}
          <input
            name="fianza"
            value={data.fianza}
            onChange={handleChange}
            placeholder="Ej: 600"
            style={inputStyle}
            required
          />{" "}
          €, que será devuelta conforme a la ley.
        </p>

        <p>
          <strong>Sexta. Observaciones:</strong>
          <textarea
            name="observaciones"
            value={data.observaciones}
            onChange={handleChange}
            style={{ width: "100%", minHeight: "80px", padding: "5px" }}
            placeholder="Observaciones adicionales..."
          />
        </p>
        <p>
          <strong>Sexta. Normativa aplicable:</strong> Ambas partes se comprometen a cumplir lo estipulado en la Ley de Arrendamientos Urbanos vigente.
        </p>

        <h5 className="mt-5">Firmas</h5>
        <p>
          Firma del ARRENDADOR: ________________________ <br />
          Firma del ARRENDATARIO: _______________________
        </p>

      </div>
      <div className="text-center mt-4">
        <button className="btn btn-secondary mt-3" onClick={() => setShowModal(true)}>
          Añadir Anexos (Fotos o PDFs)
        </button>
      </div>
      <div className="mt-3">
        <button
          className="btn btn-primary me-2"
          onClick={handleSubmit}
          disabled={isGenerating}
        >
          {isGenerating ? "Generando PDF..." : "Generar Contrato PDF"}
        </button>
      </div>
      <div className="mt-3">
        <button
          className="btn btn-success"
          onClick={handleDocuSignSend}
          disabled={isSending || !contractBlob}
          style={{ marginLeft: "10px" }}
        >
          {isSending ? "Enviando a DocuSign..." : "Enviar a DocuSign"}
        </button>
      </div>

      <ModalAnexos
        visible={showModal}
        onClose={() => setShowModal(false)}
        anexos={anexos}
        setAnexos={setAnexos}
      />

    </div>

  );
};

export default ModalContrato;
