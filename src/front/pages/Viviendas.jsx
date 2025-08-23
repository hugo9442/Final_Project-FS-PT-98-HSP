import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import { admin } from "../fetch_admin.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import NewApartmentForm from "../components/NewApartmentForm.jsx";
import NewuserForm from "../components/NewUserForm.jsx";

const Viviendas = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFormUser, setShowFormUser] = useState(false);
  const [showBotton, setShowbotton] = useState(true);
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApartments = async () => {
    try {
      let data;

      // 🔹 ADMIN → obtiene todas las viviendas con propietarios
      if (store.todos.role === "ADMIN") {
        data = await apartments.getApartmentsWithOwner(store.token);
      }
      // 🔹 PROPIETARIO → obtiene solo sus viviendas
      else if (store.todos.role === "PROPIETARIO") {
        data = await users.getUserApartments(store.todos.id, store.token);
      }

      if (data?.msg === "ok") {
        dispatch({ type: "add_apartments", value: data.apartments });
      }
    } catch (error) {
      console.error("Error al cargar viviendas:", error);
    }

    // 🔹 Solo ADMIN debe cargar propietarios
    if (store.user.role === "ADMIN") {
      try {
        const data = await admin.getOwnersByAdmin(store.todos.id, store.token);
        if (data.owners.length > 0) {
          dispatch({ type: "add_owner", value: data.owners });
        }
      } catch (error) {
        console.error("Error al cargar propietarios:", error);
      }
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

  const getRowColor = (item) => {
    if (item.has_unpaid_invoices && item.has_open_issues) return "bg-red-200";
    if (item.has_unpaid_invoices) return "bg-red-100";
    if (item.has_open_issues) return "bg-yellow-100";
    return "";
  };
console.log("store", store);
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

      {/* Tabla viviendas */}
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
              <th>Estado</th>
              <th>Alertas</th>
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
                      className={`${getRowColor(item)} border-b`}
                      onClick={() => navigate("/Viviendasassoc/" + item.id)}
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                    >
                      <td>{item.address}</td>
                      <td>{item.postal_code}</td>
                      <td>{item.city}</td>
                      <td>{item.parking_slot}</td>
                      {/* 🔹 Solo ADMIN ve el propietario */}
                      {store.user.role === "ADMIN" && <td>{item.owner_name}</td>}
                      <td>{item.type}</td>
                      <td>
                        <span className={`badge ${getDaysBadgeClass(alquilado)}`}>
                          {alquilado}
                        </span>
                      </td>
                      <td>
                        {item.has_unpaid_invoices && item.has_open_issues && (
                          <span className="badge bg-danger">Facturas + Incidencias</span>
                        )}
                        {item.has_unpaid_invoices && !item.has_open_issues && (
                          <span className="badge bg-warning text-dark">Facturas impagadas</span>
                        )}
                        {item.has_open_issues && !item.has_unpaid_invoices && (
                          <span className="badge bg-warning text-dark">Incidencias abiertas</span>
                        )}
                      </td>
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

      {/* Formularios */}
      {showForm && (
        <NewApartmentForm
          onSuccess={() => {
            setShowForm(false);
            fetchApartments();
            setShowbotton(true);
          }}
          onCancel={() => {
            setShowForm(false);
            setShowbotton(true);
          }}
        />
      )}
      {showFormUser && store.todos.role === "ADMIN" && (
        <NewuserForm
          admin_id={store.todos.id}
          onSuccess={() => {
            setShowFormUser(false);
            fetchApartments();
            setShowbotton(true);
          }}
          onCancel={() => {
            setShowFormUser(false);
            setShowbotton(true);
          }}
        />
      )}

      {/* Botones solo si corresponde */}
      {showBotton && (
        <div className="mt-3">
          {/* 🔹 ADMIN → puede añadir propietarios */}
          {store.todos.role === "ADMIN" && (
            <button
              className="btn btn-success me-2"
              style={{ color: "black", backgroundColor: "rgba(138, 223, 251, 0.8)" }}
              onClick={() => {
                setShowFormUser(true);
                setShowbotton(false);
              }}
            >
              Añadir Propietario
            </button>
          )}
          {/* 🔹 Ambos pueden añadir vivienda */}
          <button
            className="btn btn-success me-2"
            style={{ color: "black", backgroundColor: "rgba(138, 223, 251, 0.8)" }}
            onClick={() => {
              setShowForm(true);
              setShowbotton(false);
            }}
          >
            Añadir Vivienda
          </button>
        </div>
      )}
    </div>
  );
};

export default Viviendas;
