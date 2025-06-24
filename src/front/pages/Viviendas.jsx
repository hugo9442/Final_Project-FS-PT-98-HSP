
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MenuLateral from "../components/MenuLateral";
import NewApartmentForm from "../components/NewApartmentForm.jsx";

const Viviendas = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBotton, setShowbotton] = useState(true);
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApartments = async () => {
    try {
      const data = await users.getUserApartments(store.todos.id, store.token);
      if (data.msg === "ok") {
        dispatch({ type: "add_apartments", value: data.apartments });
      }
    } catch (error) {
      console.error("Error al cargar viviendas:", error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleCreatapartment = async () => {
    try {
      const data = await apartments.create_apartment(
        store.address,
        store.postal_code,
        store.city,
        store.parking_slot,
        store.is_rent,
        store.todos.id,
        store.token
      );

      if (data.msg === "La vivienda se ha registrado con exito") {
        dispatch({ type: "add_apartments", value: data.apartments });
        swal({
          title: "VIVIENDA",
          text: `${data.msg}`,
          icon: "success",
          buttons: true,
        });
      } else {
        swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
    } catch (error) {
      console.error("Error al crear vivienda:", error);
    }
  };

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
        className="list-group-item d-flex justify-content-between"
        
      >
        <div
          className="contratitem"
          onClick={() => navigate("/Viviendasassoc/" + item.id)}
          style={{ cursor: "pointer",textTransform:"capitalize"}}
        >
          <p>
            <strong>Dirección:</strong> {item.address}, <strong>CP:</strong>{" "}
            {item.postal_code}, <strong>Ciudad:</strong> {item.city},{" "}
            <strong>Parking:</strong> {item.parking_slot},{" "}
            <span className={`badge ${getDaysBadgeClass(alquilado)}`}>
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
        <div className="col-md-9">
          <div className="p-4 border rounded bg-light">
            <h2>Gestión de Viviendas</h2>
            <p>
              Aquí puedes visualizar, cargar o gestionar viviendas activas.
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
              <NewApartmentForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchApartments();
                  setShowbotton(true)
                }}
                onCancel={() => {setShowForm(false), setShowbotton(true)}}
              />
            )}
             {showBotton &&( 
            <button
              className="btn btn-success mt-3 " 
              style={{ marginLeft: "10px", display: showBotton ? "inline-block" : "none" }}
              onClick={() => {setShowForm(true),setShowbotton(false)}}
            >
              Añadir Vivienda
            </button>  )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viviendas;

