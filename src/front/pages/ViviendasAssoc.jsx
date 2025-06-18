

import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import { apartments } from "../fecht_apartment.js"
import swal from "sweetalert";
import NewActionForm from "../components/NewActionForm.jsx";


const ViviendasAssoc = () => {
  
  const { theId } = useParams();
  const { store, dispatch } = useGlobalReducer()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(null);



  const fetchData = async () => {

    try {

      const data = await contracts.getAssocByApertmentId(parseInt(theId), store.token);

      await dispatch({ type: "addAssocByApertmentId", value: data });

    } catch (error) {
    }
    try {
      const data = await apartments.getIssuesActionsByApertmentId(parseInt(theId), store.token);
      if (!data.error) {
        dispatch({ type: "add_singleIssues", value: data });
      }
    } catch (error) {
      console.error("Error fetching issues/actions:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect ejecutado");
    if (theId && store.token) {
      fetchData();
    }
  }, [theId, store.token]);


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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!store.AssocByApertmentId?.length) return <div>No hay datos disponibles</div>;

  const startDate = store.AssocByApertmentId[0]?.start_date
    ? new Date(store.AssocByApertmentId[0].start_date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }) : 'Fecha no disponible';
  const endDate = store.AssocByApertmentId[0]?.start_date ? new Date(store.AssocByApertmentId[0].end_date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }) : 'Fecha no Disponible'
  const splitDocument = store.AssocByApertmentId[0].document ? store.AssocByApertmentId[0].document.split("/").pop() : 'Sin documento';
  console.log(splitDocument)
  const today = new Date();
  const contractEndDateObj = new Date(store.AssocByApertmentId[0].end_date);
  const diffDays = differenceInDays(contractEndDateObj, today);

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
  const alquilado = !store.AssocByApertmentId[0].asociaciones[0].apartment.is_rent ? "Pendiente de Alquilar" : "Alquilado";
  const getalquilado = (alquilado) => {
    if (alquilado === "Pendiente de Alquilar") { return 'bg-danger text-white' };
    if (alquilado === "Alquilado") { return 'bg-info text-black' };
    return 'bg-success text-white';
  };

  console.log("ok")
  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">

          <div className="p-4 border rounded bg-light">
            <h2 className="mb-3">Datos de la Vivienda:</h2>
            <li className="list-group-item d-flex justify-content-between" >
              <div className="contratitem" style={{ cursor: "pointer" }}>
                <p><strong>Dirección:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.address}, <strong>CP:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.postal_code}, <strong>Ciudad:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.city}, <strong>Parking:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.parking_slot},    <span className={`badge ${getalquilado(alquilado)}`}>{alquilado}</span> </p>
              </div>

            </li>
            <div class="row align-items-start">
              <div className="col mi_alquiler">
                <div className="card h-100 shadow-sm border">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">Datos del Inquilino</h5>
                    </div>
                    <p className="card-text mb-1">
                      <strong>Nombre</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.first_name}, {store.AssocByApertmentId[0].asociaciones[0].tenant.last_name} <strong>Email:</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.email}
                    </p>
                    <p className="card-text mb-1">
                      <strong>DNI</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.national_id} <strong>Telefono:</strong>{store.AssocByApertmentId[0].asociaciones[0].tenant.phone}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Numero de Cuenta:</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.account_number}
                    </p>
                    <div className="mt-auto d-flex justify-content-end">

                    </div>
                  </div>
                </div>
              </div>
              <div className="col mi_alquiler" >
                <div className="card h-100 shadow-sm border">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">Detalle del Contrato:</h5>
                      <button
                        className="badge  bg-success text-white"
                        onClick={() => handleDownloadContract(store.AssocByApertmentId[0].id)}
                      >
                        Ver Documento
                      </button>
                      <span className={`badge ${getDaysBadgeClass(diffDays)}`}>
                        {getDaysStatusText(diffDays)}
                      </span>
                    </div>
                    <p className="card-text mb-1">
                      <strong>Inicio:</strong> {startDate}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Fin:</strong> {endDate}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Documento:</strong> {splitDocument}
                    </p>
                    <div className="mt-auto d-flex justify-content-end">

                    </div>
                  </div>
                </div>
              </div>
              <ul className="list-group mt-2">
                <h2>Incidencias</h2>
                {
                  store && store.singleIssues.issues && store.singleIssues.issues.map((item) => {
                    const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    });

                    return (
                      <li
                        key={item.issue_id}
                        className="list-group-item d-flex flex-column contenedor">
                        <div className="contratitem">
                          <p><strong>Incidencia:</strong> {item.title} <strong>Fecha de apertura:</strong> {startDate}, <strong>Estado:</strong> {item.status}</p>
                          <p><strong>Descripción:</strong> {item.description}</p>
                        </div>

                        <h5 className="mt-3">Actuaciones</h5>
                        <ul className="list-group">
                          {item.actions && item.actions.map((action) => {
                            const splitBill = action.bill_image ? action.bill_image.split("/").pop() : 'Sin documento';
                            return (
                              <li key={action.action_id} className="list-group-item">
                                <p><strong>Titulo:</strong> {action.action_name}, <strong>Contratista:</strong> {action.contractor}<strong>, Estado:</strong> {action.status}, <strong>Fecha:</strong> {new Date(action.start_date).toLocaleDateString("es-ES")}</p>
                                <p><strong>Importe:</strong> {action.bill_amount}€, <strong>Ver Factura</strong> {splitBill}   </p>
                                <p><strong>Descripción:</strong> {action.description}</p>
                              </li>
                            )
                          })}
                        </ul>

                        <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => setShowForm(item.issue_id)}>Añadir actuación</button>
                        {showForm === item.issue_id && (
                          <NewActionForm
                            issueId={item.issue_id}
                            token={store.token}
                            onSuccess={() => {
                              setShowForm(null);
                              handlegetIssuesActionsByapartmetId();
                            }}
                            onClose={() => setShowForm(false)}
                          />
                        )}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  )
};

export default ViviendasAssoc;

