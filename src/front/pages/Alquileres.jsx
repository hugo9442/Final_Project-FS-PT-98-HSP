

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
          <thead className="table-dark">
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
