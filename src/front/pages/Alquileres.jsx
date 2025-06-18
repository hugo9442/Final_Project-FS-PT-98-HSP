import React from "react";
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

      const data = await users.getUserContracts(store.todos.id, store.token);
      if (data.msg === "ok") {
        await dispatch({ type: "add_contracts", value: data.contracts });
      }
    } catch (error) {

    }
    try {

      const data = await users.getUserApartmentsNotRented(store.todos.id, store.token);
      console.log
      dispatch({ type: "add_apartments", value: data.apartments });

    } catch (error) {

    }
    try {

      const data = await users.get_asociation(store.todos.id, store.token);

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
      swal({ title: "ÉXITO", text: `${data.msg}`, icon: "success" });
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

  const Drent = async () => {
  setIsLoadingRent(true);
    try {
      await handleDeleteRent();
    } catch (error) {
      console.error("Error en Crent:", error);
    } finally {
      setIsLoadingRent(false); // Desactivar spinner cuando termine (éxito o error)
    }  
    
    
   
  };
 
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
                ) : store.contracts && store.contracts.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-3  row-cols-lg-3 g-3">
                    {store.asociation.map((item) => {

                      const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const endDate = new Date(item.end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const splitDocument = item.document ? item.document.split("/").pop() : 'Sin documento';
                      const today = new Date();
                      const contractEndDateObj = new Date(item.end_date);
                      const diffDays = differenceInDays(contractEndDateObj, today);
                      const estado= item.asociaciones[0].is_active? "activo" : "inactivo"
                      if (estado==="activo"){
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
                             {item.asociaciones[0].is_active? "activo" : "inactivo"}
                              <p className="card-text mb-1">
                                <strong>{item.asociaciones[0].tenant.first_name} {item.asociaciones[0].tenant.last_name}, </strong>
                                de fecha  <strong>{startDate}</strong> y que finaliza el <strong>{endDate}</strong>
                              </p>
                              <p className="card-text mb-1">
                                <strong>Direccion:</strong> {item.asociaciones[0].apartment.address}, <strong>CP:</strong> {item.asociaciones[0].apartment?.postal_code}, <strong>Ciudad:</strong> {item.asociaciones[0].apartment?.city}
                              </p>
                              <p className="card-text mb-3">
                                <strong>Documento:</strong> {splitDocument}
                              </p>
                              <div className="mt-auto d-flex justify-content-between">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleDownloadContract(item.id)}
                                >
                                  Consultar Contrato
                                </button>
                                 <button
                                  className="badge bg-danger text-white"
                                  onClick={() => handleDeleteRent(item.asociaciones[0].assoc_id, item.asociaciones[0].apartment.id)}
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
                ) : store.contracts && store.contracts.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-3 row-cols-lg-2 g-3">
                    {store.asociation.map((item) => {

                      const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const endDate = new Date(item.end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const splitDocument = item.document ? item.document.split("/").pop() : 'Sin documento';
                      const today = new Date();
                      const contractEndDateObj = new Date(item.end_date);
                      const diffDays = differenceInDays(contractEndDateObj, today);
                      const estado= item.asociaciones[0].is_active? "activo" : "inactivo"
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
                                <strong>{item.asociaciones[0].tenant.first_name} {item.asociaciones[0].tenant.last_name}, </strong>
                                de fecha  <strong>{startDate}</strong> y que finaliza el <strong>{endDate}</strong>
                              </p>
                              <p className="card-text mb-1">
                                <strong>Direccion:</strong> {item.asociaciones[0].apartment.address}, <strong>CP:</strong> {item.asociaciones[0].apartment?.postal_code}, <strong>Ciudad:</strong> {item.asociaciones[0].apartment?.city}
                              </p>
                              <p className="card-text mb-3">
                                <strong>Documento:</strong> {splitDocument}
                              </p>
                              <div className="mt-auto d-flex justify-content-between">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleDownloadContract(item.id)}
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

export default Alquileres;