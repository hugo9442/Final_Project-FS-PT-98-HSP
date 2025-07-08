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

const handleDownload=async()=>{
  try {
    const data = await files.downloadFile(itdoc, store.token)
  } catch (error) {
    console.error("Error al descargar documerto:", error);
  }
}
  useEffect(() => {
    fetchApartments();
  }, []);





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
              {store?.apartmentwithdocuments?.length > 0 ? (
                store.apartmentwithdocuments
                  .filter((apartment) => {
                    const fullText = `${apartment.address} ${apartment.city} ${apartment.postal_code}`.toLowerCase();
                    return fullText.includes(searchTerm.toLowerCase());
                  })
                  .map((apartment) => (
                    <li key={apartment.id} className="list-group-item mb-3">
                      <div>
                        <h5>
                          <strong>Dirección:</strong> {apartment.address}, <strong>Ciudad:</strong> {apartment.city}
                        </h5>
                        <p>
                          <strong>CP:</strong> {apartment.postal_code}, <strong>Parking:</strong> {apartment.parking_slot},{" "}
                          <strong>Tipo:</strong> {apartment.type}
                        </p>
                        {apartment.documents && apartment.documents.length > 0 ? (
                          <ul className="list-group mt-2">
                            {apartment.documents.map((doc) => (
                              <li key={doc.id} className="list-group-item d-flex contenedor">
                                <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" type="checkbox" value=""
                            id="checkDefault" onClick={() => { setItdoc(doc.id)}} /></div>
                          <div className="contratitem">
                                <span><strong>{doc.description}</strong></span>
                            </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted mt-2">Este apartamento no tiene documentos.</p>
                        )}

                        <button
                          className="btn btn-success mt-3"
                          style={{ backgroundColor: 'rgba(138, 223, 251, 0.8)', color: 'black' }}
                          onClick={handleDownload}
                        >
                          ver Documento
                        </button>
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
