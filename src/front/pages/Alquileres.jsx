{/*import React from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import NewTenantContractForm from "../components/NewTenantContractForm.jsx";


const Alquileres = () => {

  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingrent, setLoadingRent] = useState(true);
  const [associtem, setAssocitem]=useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {

      const data = await Asociations.get_full_asociates(store.token);

      await dispatch({ type: "add_asociation", value: data });

    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [store.todos, store.token]);

  const handleDownloadContract = async (contractId) => {
    console.log(`Intentando descargar contrato con ID: ${contractId}`);
    try {
      const data = await contracts.downloadcontract(contractId, store.token);
      if (data && !data.error) {
        swal("Descarga iniciada", "Tu contrato debería empezar a descargarse.", "success");
      } else {
        swal("Error de descarga", data?.error || "No se pudo descargar el contrato.", "error");
      }
    } catch (error) {
      console.error("Error al descargar contrato:", error);
      swal("Error de conexión", "No se pudo conectar para descargar el contrato.", "error");
    }
  };



  const getDaysBadgeClass = (days) => {
    if (days < 0) { return 'bg-danger text-white' };
    if (days <= 30) { return 'bg-warning text-dark' };
    if (days <= 90) { return 'bg-info text-white' };
    return 'bg-success text-white';
  };

  const getDaysStatusText = (days) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
    if (days === 0) return `Vence hoy`;
    return `Faltan ${days} días`;
  };
 const handleDeleteRent = async (assoc_id, apartment_id) => {
  const willDelete = await swal({
    title: "Estas seguro que quieres dar debaja este Alquiler",
    text: "Una vez dado de baja no podras revertir la acción",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });

  if (!willDelete) {
    swal("El alquiler sigue activo");
    return;
  }
 
  try {
    const data = await Asociations.updateasociationdeleterent(assoc_id, apartment_id, store.token);
    
    if (data.msg) {
      swal({ title: "ÉXITO", text: `${data.msg}, icon: "success"` });
      fetchData();
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
    swal({
      title: "ERROR",
      text: `${error}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
  }
};


console.log(store) 
  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="p-4 border rounded bg-light">
              <h2 className="mb-3">Alquileres Activos</h2>
              <div className="contract-list-section">
                {loading ? (
                  <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando contratos...</p></div>
                ) : error ? (
                  <div className="alert alert-danger text-center p-3">{error}</div>
                ) : store.asociation && store.asociation.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-1  row-cols-lg-1 g-3">
                    {store.asociation.map((item) => {

                      const startDate = new Date(item.contract.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const endDate = new Date(item.contract.end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const splitDocument = item.contract.document ? item.contract.document.split("/").pop() : 'Sin documento';
                      const start = splitDocument.length - 20;

                    const cleanFileName = () => {
                      if (splitDocument !== "Sin documento") {
                        return (
                          splitDocument.slice(0, start) +
                          splitDocument.slice(start + 16)
                        );
                      } else {
                        return splitDocument;
                      }
                    };

                    const result = cleanFileName();
                      const today = new Date();
                      const contractEndDateObj = new Date(item.contract.end_date);
                      const diffDays = differenceInDays(contractEndDateObj, today);
                      const estado= item.is_active? "activo" : "inactivo"
                      
                      if (estado==="activo" && item.apartment !== null ){
                         return (
                        <div className="col mi_alquiler" key={item.id}>
                          <div className="card h-100 shadow-sm border">
                            <div className="card-body d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">Alquiler con:</h5>
                                <span className={`badge ${getDaysBadgeClass(diffDays)}`}>
                                  {getDaysStatusText(diffDays)}
                                </span>
                              </div>
                             <table className="table table-sm mt-3 mb-0">
              <tbody>
                <tr>
                  <th>Inquilino</th>
                  <td>{item.tenant.first_name} {item.tenant.last_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{item.tenant.email}</td>
                </tr>
                <tr>
                  <th>Inicio</th>
                  <td>{startDate}</td>
                </tr>
                <tr>
                  <th>Fin</th>
                  <td>{endDate}</td>
                </tr>
                <tr>
                  <th>Dirección</th>
                  <td>{item.apartment?.address}</td>
                </tr>
                <tr>
                  <th>CP / Ciudad</th>
                  <td>{item.apartment?.postal_code}, {item.apartment?.city}</td>
                </tr>
                <tr>
                  <th>Renta</th>
                  <td>{item.renta} €</td>
                </tr>
                <tr>
                  <th>Documento</th>
                  <td>{result}</td>
                </tr>
              </tbody>
            </table>
                              <p className="card-text mb-1">
                                <strong>{item.tenant.first_name} {item.tenant.last_name}, </strong> <strong>email:</strong> {item.tenant.email} {""}
                                de fecha  <strong>{startDate}</strong> y que finaliza el <strong>{endDate}</strong>
                              </p>
                              <p className="card-text mb-1">
                                <strong>Direccion:</strong> {item.apartment?.address}, <strong>CP:</strong> {item.apartment?.postal_code}, <strong>Ciudad:</strong> {item.apartment?.city}
                              </p>
                              <p>
                                <strong>Renta</strong> {item.renta}
                              </p>
                              <p className="card-text mb-3">
                                <strong>Documento:</strong> {result}
                              </p>
                              <div className="pt-1 mb-4 justify-content-between">
                                <button
                                  className="badge bg-info text-white "
                                  onClick={() => handleDownloadContract(item.contract.id)}
                                >
                                  Consultar Contrato
                                </button>
                                 <button
                                  className="badge bg-danger text-white ms-3"
                                  onClick={() => handleDeleteRent(item.contract.id, item.apartment.id)}
                                >
                                  Dar de baja este Alquiler
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );

                      } 
                     
                    })}
                  </div>
                ) : (
                  <div className="alert alert-info text-center">No hay contratos registrados para este usuario.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="p-4 border rounded bg-light">
              <h2 className="mb-3">Alquileres Inactivos</h2>
              <div className="contract-list-section">
                {loading ? (
                  <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando contratos...</p></div>
                ) : error ? (
                  <div className="alert alert-danger text-center p-3">{error}</div>
                ) : store.asociation && store.asociation.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-3 row-cols-lg-2 g-3">
                    {store.asociation.map((item) => {

                      const startDate = new Date(item.contract.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const endDate = new Date(item.contract.end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const splitDocument = item.contract.document ? item.contract.document.split("/").pop() : 'Sin documento';
                      const today = new Date();
                      const contractEndDateObj = new Date(item.contract.end_date);
                      const diffDays = differenceInDays(contractEndDateObj, today);
                      const estado= item.is_active? "activo" : "inactivo"
                      if (estado==="inactivo"){
                         return (
                        <div className="col mi_alquiler" key={item.id}>
                          <div className="card h-100 shadow-sm border">
                            <div className="card-body d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">Alquiler con:</h5>
                                <span className={`badge bg-danger text-white`}>
                                  INACTIVO</span>
                              </div>
                            
                              <p className="card-text mb-1">
                                <strong>{item.tenant.first_name} {item.tenant.last_name}, </strong>
                                de fecha  <strong>{startDate}</strong> y que finaliza el <strong>{endDate}</strong>
                              </p>
                              <p className="card-text mb-1">
                                <strong>Direccion:</strong> {item.apartment?.address}, <strong>CP:</strong> {item.apartment?.postal_code}, <strong>Ciudad:</strong> {item.apartment?.city}
                              </p>
                              <p className="card-text mb-3">
                                <strong>Documento:</strong> {splitDocument}
                              </p>
                              <div className="mt-auto d-flex justify-content-between">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleDownloadContract(item.contract.id)}
                                >
                                  Consultar Contrato
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );

                      } 
                     
                    })}
                  </div>
                ) : (
                  <div className="alert alert-info text-center">No hay contratos registrados para este usuario.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default Alquileres;*/}

import React, { useEffect, useState } from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import NewTenantContractForm from "../components/NewTenantContractForm.jsx";

const Alquileres = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Asociations.get_full_asociates(store.token);
      await dispatch({ type: "add_asociation", value: data });
    } catch (error) {
      setError("Error al cargar datos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [store.todos, store.token]);

  const handleDownloadContract = async (contractId) => {
    try {
      const data = await contracts.downloadcontract(contractId, store.token);
      if (data && !data.error) {
        swal("Descarga iniciada", "Tu contrato debería empezar a descargarse.", "success");
      } else {
        swal("Error de descarga", data?.error || "No se pudo descargar el contrato.", "error");
      }
    } catch (error) {
      swal("Error de conexión", "No se pudo conectar para descargar el contrato.", "error");
    }
  };

  const handleDeleteRent = async (assoc_id, apartment_id) => {
    const willDelete = await swal({
      title: "¿Estás seguro?",
      text: "Una vez dado de baja no podrás revertir la acción.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (!willDelete) {
      swal("El alquiler sigue activo");
      return;
    }

    try {
      const data = await Asociations.updateasociationdeleterent(assoc_id, apartment_id, store.token);
      if (data.msg) {
        swal({ title: "ÉXITO", text: `${data.msg}`, icon: "success" });
        fetchData();
      } else {
        swal({ title: "ERROR", text: `${data.error}`, icon: "warning" });
      }
    } catch (error) {
      swal({ title: "ERROR", text: `${error}`, icon: "warning" });
    }
  };
    const getDaysDiff = (start, end) => {
    const now = new Date();
    const endDate = new Date(end);
    const diffTime = endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysBadgeClass = (days) => {
    if (days < 0) return 'bg-danger text-white';
    if (days <= 30) return 'bg-warning text-dark';
    if (days <= 90) return 'bg-info text-white';
    return 'bg-success text-white';
  };

  const getDaysStatusText = (days) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
    if (days === 0) return `Vence hoy`;
    return `Faltan ${days} días`;
  };

  const renderTable = (isActive = true) => {
    const filtered = (store.asociation || []).filter(item => item.is_active === isActive && item.apartment);
    if (!filtered.length) return <div className="alert alert-info text-center">No hay contratos {isActive ? "activos" : "inactivos"}.</div>;

    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Estado</th>
              <th>Inquilino</th>
              <th>Email</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Dirección</th>
              <th className="d-none d-md-table-cell">CP</th>
              <th className="d-none d-md-table-cell">Ciudad</th>
              <th>Renta</th>
              <th className="d-none d-md-table-cell">Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const startDate = new Date(item.contract.start_date).toLocaleDateString("es-ES", {
                day: "2-digit", month: "long", year: "numeric"
              });
              const endDate = new Date(item.contract.end_date).toLocaleDateString("es-ES", {
                day: "2-digit", month: "long", year: "numeric"
              });
              const today = new Date();
              const contractEndDate = new Date(item.contract.end_date);
              const diffDays = getDaysDiff(item.contract.start_date, item.contract.end_date);
              //const diffDays = differenceInDays(contractEndDate, today);
              const splitDocument = item.contract.document ? item.contract.document.split("/").pop() : 'Sin documento';
              const start = splitDocument.length - 20;
              const result = splitDocument !== "Sin documento"
                ? splitDocument.slice(0, start) + splitDocument.slice(start + 16)
                : splitDocument;

              return (
                <tr key={item.id}>
                  <td>
                    <span className={`badge ${isActive ? getDaysBadgeClass(diffDays) : 'bg-danger text-white'}`}>
                      {isActive ? getDaysStatusText(diffDays) : "INACTIVO"}
                    </span>
                  </td>
                  <td>{item.tenant.first_name} {item.tenant.last_name}</td>
                  <td>{item.tenant.email}</td>
                  <td>{startDate}</td>
                  <td>{endDate}</td>
                  <td>{item.apartment?.address}</td>
                  <td className="d-none d-md-table-cell">{item.apartment?.postal_code}</td>
                  <td className="d-none d-md-table-cell">{item.apartment?.city}</td>
                  <td>{item.renta} €</td>
                  <td className="d-none d-md-table-cell">{result}</td>
                  <td>
                    <div className="d-flex flex-column flex-md-row gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleDownloadContract(item.contract.id)}
                      >
                        Ver contrato
                      </button>
                      {isActive && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteRent(item.contract.id, item.apartment.id)}
                        >
                          Dar de baja
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="p-4 border rounded bg-light">
            <h2 className="mb-3">Alquileres Activos</h2>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando contratos...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center p-3">{error}</div>
            ) : (
              renderTable(true)
            )}
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="p-4 border rounded bg-light">
            <h2 className="mb-3">Alquileres Inactivos</h2>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando contratos...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center p-3">{error}</div>
            ) : (
              renderTable(false)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alquileres;
