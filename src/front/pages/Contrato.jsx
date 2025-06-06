import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Contrato = () => {
  const { store, dispatch } = useGlobalReducer();
  const [showAddContractForm, setShowAddContractForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!store.todos || !store.todos.id || !store.token) {
        console.warn("No hay usuario (en store.todos) o token para cargar contratos.");
        setError("Inicia sesión para ver tus contratos.");
        setLoading(false);
        return;
      }

      const data = await users.getUserContracts(store.todos.id, store.token);
      if (data && !data.error) {
        dispatch({ type: "add_contracts", value: data.contracts });
      } else {
        console.error("Error al cargar contratos:", data?.error || "Error desconocido");
        setError(data?.error || "No se pudieron cargar los contratos.");
      }
    } catch (err) {
      console.error("Error en fetchData para contratos:", err);
      setError("Error de conexión al cargar contratos.");
    } finally {
      setLoading(false);
    }
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

  const Ccontract = async () => {
    if (!store.contract_start_date || !store.contract_end_date || !store.contract) {
        swal("Campos incompletos", "Por favor, rellena todas las fechas y sube el archivo del contrato.", "warning");
        return;
    }
    await handleCreatecontract();
  };

  const handleCreatecontract = async () => {
    try {
      const data = await contracts.create_contract(
        store.contract_start_date,
        store.contract_end_date,
        store.contract,
        store.todos.id,
        store.token
      );
      console.log(data);
      if (data.message === "El contrato ha sido registrado satisfactoriamente") {
        swal({
          title: "CONTRATO",
          text: "El contrato ha sido registrado satisfactoriamente",
          icon: "success",
          buttons: true,
        }).then(() => {
            fetchData();
            setShowAddContractForm(false);
            dispatch({ type: "addstart_date", value: "" });
            dispatch({ type: "addend_date", value: "" });
            dispatch({ type: "addcontract", value: null });
        });
      } else {
        swal({
          title: "ERROR",
          text: `${data.error || "Error desconocido al registrar el contrato."}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
    } catch (error) {
      console.error("Error al crear contrato:", error);
      swal({
        title: "ERROR",
        text: "Error de conexión al registrar el contrato.",
        icon: "error",
        buttons: true,
        dangerMode: true,
      });
    }
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

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <MenuLateral setActiveOption={() => { }} />

          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2 className="mb-3">Gestión de Contratos</h2>
              <p className="mb-4">Aquí puedes visualizar, cargar o gestionar contratos de tus propiedades.</p>

              <button
                className="btn btn-primary mb-4"
                onClick={() => setShowAddContractForm(true)}
                style={{ display: showAddContractForm ? 'none' : 'block' }}
              >
                Añadir Contrato
              </button>

              <div className="contract-list-section" style={{ display: showAddContractForm ? 'none' : 'block' }}>
                {loading ? (
                    <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando contratos...</p></div>
                ) : error ? (
                    <div className="alert alert-danger text-center p-3">{error}</div>
                ) : store.contracts && store.contracts.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3">
                    {store.contracts.map((item) => {
                      const startDate = new Date(item.contract_start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const endDate = new Date(item.contract_end_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      const splitDocument = item.document ? item.document.split("/").pop() : 'Sin documento';
                      const today = new Date();
                      const contractEndDateObj = new Date(item.contract_end_date);
                      const diffDays = differenceInDays(contractEndDateObj, today);

                      return (
                        <div className="col" key={item.id}>
                          <div className="card h-100 shadow-sm border">
                            <div className="card-body d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="card-title mb-0">Contrato #{item.id}</h5>
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
                    })}
                  </div>
                ) : (
                    <div className="alert alert-info text-center">No hay contratos registrados para este usuario.</div>
                )}
              </div>

              <div className="form mt-4 p-4 border rounded" style={{ display: showAddContractForm ? 'block' : 'none' }}>
                <h4 className="mb-4">Registrar Nuevo Contrato</h4>
                <div className="mb-3">
                  <label htmlFor="start_day" className="form-label">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start_day"
                    value={store.contract_start_date || ''}
                    onChange={(e) => dispatch({ type: "addstart_date", value: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="end_day" className="form-label">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_day"
                    value={store.contract_end_date || ''}
                    onChange={(e) => dispatch({ type: "addend_date", value: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="pdfUpload" className="form-label">
                    Sube tu contrato en PDF
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="pdfUpload"
                    accept="application/pdf"
                    onChange={(e) => dispatch({ type: "addcontract", value: e.target.files[0] })}
                  />
                </div>
                <button className="btn btn-success me-2" onClick={Ccontract}>
                  Guardar Contrato
                </button>
                <button className="btn btn-secondary"
                  onClick={() => setShowAddContractForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contrato;