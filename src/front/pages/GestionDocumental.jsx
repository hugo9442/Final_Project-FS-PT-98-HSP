
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


  return (
    <div className="mt-4 p-4 border rounded bg-light">
                <h2>Gestión Documental</h2>
      <h3> 📄Aquí Puedes Cargar o Gestionar Tus Documentos.</h3>

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
                  const bgColor = itpartment === item.id ? "#f8d7da" : "#f2f3f2ff"; // rojo claro / verde claro


                  return (
                    <tr
                      key={item.id}
                      className=" border-b"
                      onClick={() => { setItapartment(item.id) }}
                      style={{ cursor: "pointer", textTransform: "capitalize" }}
                    >
                      <td style={{ backgroundColor: bgColor }}>{item.address}</td>
                      <td style={{ backgroundColor: bgColor }}>{item.postal_code}</td>
                      <td style={{ backgroundColor: bgColor }}>{item.city}</td>
                      <td style={{ backgroundColor: bgColor }}>{item.parking_slot}</td>
                      <td style={{ backgroundColor: bgColor }}>{item.owner_name}</td>
                      <td style={{ backgroundColor: bgColor }}>{item.type}</td>
                      <td style={{ backgroundColor: bgColor }}>
                        <span className={`badge ${getDaysBadgeClass(alquilado)}`}>
                          {alquilado}
                        </span>
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


     {showBotton && (
  <button
    className="btn btn-success mt-3"
    style={{
      color: "black",
      backgroundColor: 'rgba(138, 223, 251, 0.8)',
      marginLeft: "10px",
    }}
    onClick={() => {
      setShowForm(true);
      setShowbotton(false);
    }}
  >
    Añadir Documento
  </button>
)}

{/* Modal con formulario */}
{showForm && (
  <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Nuevo Documento</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowForm(false);
              setShowbotton(true);
            }}
          ></button>
        </div>
        <div className="modal-body">
          <NewDocumentsForm
            apartmentId={itpartment}
            token={store.token}
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
        </div>
      </div>
    </div>

    {/* Fondo oscuro del modal */}

  </div>
)}
    </div >
  );

};

export default GestionDocumental;

