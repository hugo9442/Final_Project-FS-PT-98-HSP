import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contractor } from "../fecht_contractor.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import NewContractorForm from "../components/NewContractorForm.jsx";

const Contractors = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBotton, setShowBotton] = useState(true);
  const { store, dispatch } = useGlobalReducer();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate=useNavigate()

  const fetchContractors = async () => {
    try {
      const data = await contractor.getContractor(store.token);
      console.log(data)
      if (data.msg === "ok") {
        console.log("contractor", data.contractor)
        dispatch({ type: "add_contractor", value: data.contractor });
      }
    } catch (error) {
      console.error("Error al cargar contractors:", error);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);
console.log(store)
  return (
    <div className="mt-4 p-4 border rounded bg-light">
      <h2>Gestión de Contractors / Proveedores</h2>
      <p>Aquí puedes visualizar o añadir nuevos Contractors / Proveedores.</p>
      
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre, CIF o categoría"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>CIF/NIF</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Categoría</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {store?.contractor?.length > 0 ? (
              store.contractor
                .filter((item) => {
                  const fullText = `${item.name} ${item.cif} ${item.category}`.toLowerCase();
                  return fullText.includes(searchTerm.toLowerCase());
                })
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.cif}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.category}</td>
                    <td>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => navigate(`/contractor/${item.id}`)}
            >
              Ver
            </button>
          </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Todavía no has registrado ningún contractor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <NewContractorForm
          onSuccess={() => {
            setShowForm(false);
            fetchContractors();
            setShowBotton(true);
          }}
          onCancel={() => {
            setShowForm(false);
            setShowBotton(true);
          }}
        />
      )}

      {showBotton && (
        <div className="mt-3">
          <button
            className="btn btn-success"
            style={{
              color: "black",
              backgroundColor: "rgba(138, 223, 251, 0.8)",
            }}
            onClick={() => {
              setShowForm(true);
              setShowBotton(false);
            }}
          >
            Añadir Contractor
          </button>
        </div>
      )}
    </div>
  );
};

export default Contractors;

