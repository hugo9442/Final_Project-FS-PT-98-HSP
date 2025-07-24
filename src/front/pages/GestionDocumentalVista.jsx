import React, { useState, useEffect } from "react";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import { files } from "../fetch_documents.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import NewDocumentsForm from "../components/NewDocumentsForm.jsx";
import { document } from "postcss";

const GestionDocumentalVista = () => {
  const [showForm, setShowForm] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const [searchTerm, setSearchTerm] = useState("");
  const [itdoc, setItdoc] = useState();
  const [apartamentoActivo, setApartamentoActivo] = useState(null); // ✅ cambio

  const fetchApartments = async () => {
    try {
      const data = await apartments.getApartmentswithdocuments(store.token);
      if (data.msg === "ok") {
        dispatch({ type: "add_apartmentswhitdocuments", value: data.apartments });
      }
    } catch (error) {
      console.error("Error al cargar documents:", error);
    }
    try {
      const data = await users.getUser_all(store.token);
      if (data.length > 0) {
        dispatch({ type: "add_owner", value: data });
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const data = await files.downloadFile(itdoc, store.token);
    } catch (error) {
      console.error("Error al descargar documento:", error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="p-4 border rounded bg-light">
            <h2>Gestión Documental</h2>
            <h3> 📄Aquí Descargar Tus Documentos.</h3>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por dirección, ciudad o código postal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className="list-group">
              {store?.apartmentwithdocuments?.length > 0 ? (
                store.apartmentwithdocuments
                  .filter((apartment) => {
                    const fullText = `${apartment.address} ${apartment.city} ${apartment.postal_code}`.toLowerCase();
                    return fullText.includes(searchTerm.toLowerCase());
                  })
                  .map((apartment) => (
                    <li
                      key={apartment.id}
                      className="list-group-item mb-3"
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                      onClick={() => setApartamentoActivo((prev) => (prev === apartment.id ? null : apartment.id)) }// ✅ click para activar
                
                    >
                      <div>
                        <h7>
                          <strong>Dirección:</strong> {apartment.address},  <strong>Ciudad:</strong> {apartment.city}, <strong>CP:</strong> {apartment.postal_code}, <strong>Parking:</strong>{" "}
                          {apartment.parking_slot}, <strong>Tipo:</strong> {apartment.type}
                        </h7>
                        <p>

                        </p>

                        {apartamentoActivo === apartment.id && apartment.documents?.length > 0 ? (
                          <ul className="list-group mt-2">
                            {apartment.documents.map((doc) => (
                              <li
                                key={doc.id}
                                className="list-group-item d-flex contenedor"
                                onClick={(e) => {
                                  e.stopPropagation(); // ✅ evita que se cierre al hacer click en un documento
                                  setItdoc(doc.id);
                                  handleDownload();
                                }}
                              >
                                <div className="contratitemdoc">
                                  <span><strong>{doc.description}</strong></span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {apartamentoActivo === apartment.id && (!apartment.documents || apartment.documents.length === 0) && (
                          <p className="text-muted mt-2">Este apartamento no tiene documentos.</p>
                        )}
                      </div>
                    </li>
                  ))
              ) : (
                <h5 className="mt-3 text-muted">
                  Todavía no has registrado ninguna vivienda con documentos.
                </h5>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionDocumentalVista;
