import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { PDFDocument, rgb } from "pdf-lib";
import ModalAnexos from "../components/ModalAnexos";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import ModalContrato from "../components/NewContratoAlquilerForm.jsx";
import { apartments } from "../fecht_apartment.js";

const A4_WIDTH = 595.28; // puntos
const A4_HEIGHT = 841.89; // puntos
const MARGIN = 20; // margen en pts

const ContratoAlquilerEditable = () => {
  const contratoRef = useRef();
  const [anexos, setAnexos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalContrato, setShowModalContrato] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const [iapartment, setItapartment] = useState(null);
  const [ownerid, setOwnerid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataApartment, setDataApartment] = useState(null);
  const fetchData = async () => {

    try {

      const data = await users.getApartmentsNotRented(store.token);

      dispatch({ type: "add_apartments", value: data.apartments });

    } catch (error) {

    }
  };
  useEffect(() => {
    if (store.todos?.id && store.token) {
      fetchData();
    }
  }, [store.todos, store.token])



  console.log(dataApartment)
  return (
    <div className="mt-4 p-4 border rounded bg-light">
      <h2>Gestión de Viviendas</h2>
      <p>Aquí Puedes Visualizar, Cargar o Gestionar Tus Viviendas.</p>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por dirección, ciudad o código postal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Dirección</th>
              <th>CP</th>
              <th>Ciudad</th>
              <th>Parking</th>
              <th>Propietario</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {store?.apartments?.length > 0 ? (
              store.apartments
                .filter((item) => {
                  const fullText = `${item.address} ${item.city} ${item.postal_code}`.toLowerCase();
                  return fullText.includes(searchTerm.toLowerCase());
                })
                .map((item) => {
                  const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";


                  return (
                    <tr
                      key={item.id}

                      onClick={() => {
                        setItapartment(item.id); 
                        setDataApartment({
                          apartment_id: item.id,
                          direccion: item.address,
                          ciudad: item.city,
                          postal_code: item.postal_code,
                          parking_slot: item.parking_slot,
                          type: item.type,
                          owner_id: item.owner_id,
                          owner_name: item.owner_name,
                          owner_last_name: item.owner_last_name,
                          owner_email: item.owner_email,
                          owner_phone: item.owner_phone,
                          owner_national_id: item.onwer_national_id
                        });
                      }}
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                    >
                      <td>{item.address}</td>
                      <td>{item.postal_code}</td>
                      <td>{item.city}</td>
                      <td>{item.parking_slot}</td>
                      <td>{item.owner_name}</td>
                      <td>{item.type}</td>

                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Todavía no has registrado ninguna vivienda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className=" d-flex gap-2 flex-row mt-2">
        <button className="btn btn-outline-primary" onClick={() => setShowModalContrato(true)} disabled={ !iapartment }>
          Abrir Contarato
        </button>
        <button className="btn btn-outline-secondary" onClick={() => setShowModalContrato(false)} style={{ display: showModalContrato ? "inline-block" : "none" }}>
          Cerrar Contarato
        </button>
      </div>
   <ModalContrato
  dataApartment={dataApartment}
  visible={showModalContrato}  // <--- Nuevo prop "visible"
  key={iapartment}
/>
    </div>

  );
};

export default ContratoAlquilerEditable;
