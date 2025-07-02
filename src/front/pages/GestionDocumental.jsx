
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MenuLateral from "../components/MenuLateral";
import NewDocumentsForm from "../components/NewDocumentsForm.jsx";

const GestionDocumental = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBotton, setShowbotton] = useState(true);
  const { store, dispatch } = useGlobalReducer();
  const [searchTerm, setSearchTerm] = useState("");
  const [itpartment, setItapartment] = useState()

  const fetchApartments = async () => {
    try {
      const data = await apartments.getApartmentsWithOwner(store.token);
      console.log("apartmnets en viviendas", data)

      if (data.msg === "ok") {
        console.log(data.apartments)
        dispatch({ type: "add_apartments", value: data.apartments });
      }
    } catch (error) {
      console.error("Error al cargar viviendas:", error);
    }
    try {
      const data = await users.getUser_all(store.token);
      if (data.length > 0) {
        dispatch({ type: "add_owner", value: data });
      }
    } catch (error) {
      console.error("Error al cargar viviendas:", error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);



  const getDaysBadgeClass = (alquilado) => {
    if (alquilado === "Pendiente de Alquilar") return "bg-danger text-white";
    if (alquilado === "Alquilado") return "bg-info text-black";
    return "bg-success text-white";
  };

  const renderApartmentItem = (item) => {
    const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";

    return (
      <li
        key={item.id}
        className="list-group-item d-flex contenedor" >
        <div className="mi-div p-3 mb-2 bg-info text-dark">
          <input className="form-check-input" type="checkbox" value=""
          id="checkDefault" onClick={() => { setItapartment(item.id) }} />
          </div>
        <div className="contratitem">
          <p>
            <strong>Dirección:</strong> {item.address}, <strong>CP:</strong>{" "}
            {item.postal_code}, <strong>Ciudad:</strong> {item.city},{" "}
            <strong>Parking:</strong> {item.parking_slot}, <strong>Propietario:</strong> {item.owner_name}, <strong>Tipo:</strong> {item.type} <span className={`badge ${getDaysBadgeClass(alquilado)}`}>
              {alquilado}
            </span>
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="p-4 border rounded bg-light">
            <h2>Gestión Documental por Viviendas</h2>
            <p>
              Aquí Puedes Visualizar, Cargar o Gestionar Tus Documentos.
            </p>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por dirección, ciudad o código postal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className="list-group">
              {store?.apartments?.length > 0 ? (
                store && store.apartments
                  .filter((item) => {
                    const fullText = `${item.address} ${item.city} ${item.postal_code}`.toLowerCase();
                    return fullText.includes(searchTerm.toLowerCase());
                  }).map((item) => renderApartmentItem(item))
              ) : (
                <h5 className="mt-3 text-muted">
                  Todavía no has registrado ninguna vivienda.
                </h5>
              )}
            </ul>

            {showForm && (
              <NewDocumentsForm
               apartmentId={itpartment}
                token={store.token}
                onSuccess={() => {
                  setShowForm(false);
                  fetchApartments();
                  setShowbotton(true);
                }}
                onCancel={() => { setShowForm(false), setShowbotton(true) }}
              />
            )}

            {showBotton && (
              <button
                className="btn btn-success mt-3 "
                style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                  marginLeft: "10px", display: showBotton ? "inline-block" : "none"
                }}

                onClick={() => { setShowForm(true), setShowbotton(false) }}
              >
                Añadir Documento
              </button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionDocumental;

