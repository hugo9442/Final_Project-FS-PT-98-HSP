

import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import { apartments } from "../fecht_apartment.js"
import { Issues } from "../fecht_issues.js";
import { expenses } from "../fecht_expenses.js";
import { files } from "../fetch_documents.js";
import swal from "sweetalert";
import NewActionForm from "../components/NewActionForm.jsx";
import NewFormIssues from "../components/NewIssuesForm.jsx";
import NewExpensesForm from "../components/NewExpensesform.jsx";
import * as XLSX from "xlsx";

const ViviendasAssoc = () => {
  const { theId } = useParams();
  const { store, dispatch } = useGlobalReducer()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(null);
  const [showFormissues, setShowFormissues] = useState(false);
  const [showFormExpenses, setShowFormExpenses] = useState(false);
  const [showBotton, setShowbotton] = useState(true);
  // Estado para manejar qué descripción está expandida
  const [expandedDesc, setExpandedDesc] = useState({});

  const fetchData = async () => {
    try {
      const data = await contracts.getAssocByApertmentId(parseInt(theId), store.token);
      dispatch({ type: "addAssocByApertmentId", value: data });
    } catch (error) { }
    try {
      const data = await apartments.getIssuesActionsByApertmentId(parseInt(theId), store.token);
      if (!data.error) {
        dispatch({ type: "add_singleIssues", value: data });
      }
    } catch (error) {
      console.error("Error fetching issues/actions:", error);
    }
    try {
      const data = await expenses.get_expenses_by_apartmet(parseInt(theId), store.token);
      if (!data.error) {
        dispatch({ type: "add_expenses", value: data.expenses });
      }
    } catch (error) {
      console.error("Error fetching issues/actions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (theId && store.token) {
      fetchData();
    }
  }, [theId, store.token]);

  const exportTableToExcel = () => {
    const table = document.getElementById("expenses-table"); // ID que asignaremos abajo
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Gastos" });

    // Generar y descargar el archivo
    XLSX.writeFile(workbook, "gastos.xlsx");
  };

  const handlegetIssuesActionsByapartmetId = async () => {
    try {
      const data = await apartments.getIssuesActionsByApertmentId(parseInt(theId), store.token);
      if (!data.error) {
        dispatch({ type: "add_singleIssues", value: data });
      }
    } catch (error) {
      console.error("Error fetching issues/actions:", error);
    }
  };
  const handleget_expenses_by_apartmet = async () => {
    try {
      const data = await expenses.get_expenses_by_apartmet(parseInt(theId), store.token);
      if (!data.error) {
        dispatch({ type: "add_expenses", value: data.expenses });;
      }
    } catch (error) {
      console.error("Error fetching issues/actions:", error);
    }
  };
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
    })
    : 'Fecha no disponible';
  const endDate = store.AssocByApertmentId[0]?.end_date
    ? new Date(store.AssocByApertmentId[0].end_date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
    : 'Fecha no Disponible';

  const splitDocument = store.AssocByApertmentId[0].document ? store.AssocByApertmentId[0].document.split("/").pop() : 'Sin documento';
  const lengthIssues = () => {

    return store.singleIssues?.issues?.length || 0;
  }
  const issueslength = lengthIssues()
  const today = new Date();
  const contractEndDateObj = new Date(store.AssocByApertmentId[0].end_date);
  const diffDays = differenceInDays(contractEndDateObj, today);

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

  const alquilado = !store.AssocByApertmentId[0].asociaciones[0].apartment.is_rent
    ? "Pendiente de Alquilar"
    : "Alquilado";

  const getalquilado = (alquilado) => {
    if (alquilado === "Pendiente de Alquilar") return 'bg-danger text-white';
    if (alquilado === "Alquilado") return 'bg-info text-black';
    return 'bg-success text-white';
  };

  const CloseIsusses = async (item) => {
    try {
      const data = await Issues.CloseIssues(item, store.token);
      console.log(data);
      handlegetIssuesActionsByapartmetId();
    } catch (error) {
      console.log("error");
    }
  };
  const showDocument = async (item) => {
    try {
      const data = await files.downloadFile(item, store.token);
      console.log(data);

    } catch (error) {
      console.log("error");
    }
  };

  // Función para alternar el "Ver más" de la descripción
  const toggleDesc = (id) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Limite de caracteres antes de mostrar "ver más"
  const DESC_LIMIT = 120;
  console.log(store)
  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="p-4 border rounded bg-light w-100">
            <h2 className="mb-3">Datos de la Vivienda:</h2>
            <li className="list-group-item d-flex justify-content-between">
              <div className="contratitem" style={{ textTransform: "capitalize" }}>
                <p>
                  <strong>Dirección:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.address},{" "}
                  <strong>CP:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.postal_code},{" "}
                  <strong>Ciudad:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.city},{" "}
                  <strong>Parking:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.parking_slot}{" "}
                  <span className={`badge ${getalquilado(alquilado)}`}>{alquilado}</span>
                </p>
              </div>
            </li>

            <div className="row align-items-start mb-4">
              <div className="col mi_alquiler">
                <div className="card h-100 shadow-sm border">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">Datos del Inquilino</h5>
                    </div>
                    <p className="card-text mb-1">
                      <strong>Nombre</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.first_name}, {store.AssocByApertmentId[0].asociaciones[0].tenant.last_name}{" "}
                      <strong>Email:</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.email}
                    </p>
                    <p className="card-text mb-1">
                      <strong>DNI</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.national_id}{" "}
                      <strong>Telefono:</strong>{store.AssocByApertmentId[0].asociaciones[0].tenant.phone}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Numero de Cuenta:</strong> {store.AssocByApertmentId[0].asociaciones[0].tenant.account_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col mi_alquiler">
                <div className="card h-100 shadow-sm border">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">Detalle del Contrato:</h5>
                      <button
                        className="badge bg-success text-white"
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
                  </div>
                </div>
              </div>
            </div>

            {/* Aquí empieza la tabla de incidencias */}
            <h2> Total Incidencias Registradas {issueslength} </h2>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Incidencia</th>
                    <th>Fecha de apertura</th>
                    <th>Estado</th>
                    <th>Descripción</th>
                    <th>Actuaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {store && store.singleIssues.issues && store.singleIssues.issues.map((item) => {
                    const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    });

                    const isExpanded = expandedDesc[item.issue_id] || false;
                    const descriptionTooLong = item.description.length > DESC_LIMIT;
                    const actuaciones = item.actions.length

                    return (
                      <tr key={item.issue_id}>
                        <td>{item.title}</td>
                        <td>{startDate}</td>
                        <td>
                          <span className={`badge ${item.status === "cerrado" ? "bg-success text-black" : "bg-danger text-white"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          {descriptionTooLong && !isExpanded
                            ? `${item.description.substring(0, DESC_LIMIT)}... `
                            : item.description + " "}
                          {descriptionTooLong && (
                            <button
                              className="btn btn-link btn-sm p-0"
                              onClick={() => toggleDesc(item.issue_id)}
                              style={{ verticalAlign: 'baseline' }}
                            >
                              {isExpanded ? 'Ver menos' : 'Ver más'}
                            </button>
                          )}
                        </td>
                        <td>{actuaciones}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <Link
                            to={`/singleissue/${item.apartment_id}/${item.issue_id}`}
                            className="btn btn-sm btn-primary me-1"
                          >
                            Ver incidencia
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => CloseIsusses(item.issue_id)}
                            disabled={item.status === 'cerrado'}
                          >
                            Cerrar incidencia
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Formulario para añadir incidencias */}
            {showFormissues && (
              <NewFormIssues
                apartmentId={parseInt(theId)}
                token={store.token}
                onSuccess={() => {
                  setShowFormissues(false);
                  setShowbotton(true);
                  handlegetIssuesActionsByapartmetId();
                }}
                onCancel={() => {
                  setShowFormissues(false);
                  setShowbotton(true);
                }}
              />
            )}

            {showBotton && (
              <button
                className="btn btn-success mt-3"
                style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                  display: showBotton ? "inline-block" : "none"
                }}
                onClick={() => {
                  setShowFormissues(true);
                  setShowbotton(false);
                }}
              >
                Añadir incidencia
              </button>
            )}
            <h2>Gastos</h2> <button className="btn btn-outline-primary mb-3" onClick={exportTableToExcel}>
              Exportar gastos a Excel
            </button>

            <div className="table-responsive">
              <table id="expenses-table" className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Gasto</th>
                    <th>Fecha de apertura</th>
                    <th>Balance</th>
                    <th>Descripción</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {store && store.expenses.map((item) => {

                    const splitDocumentExpense = item.document?.file_url
                      ? item.document.file_url.split("/").pop()
                      : "Sin documento";

                    const start = splitDocumentExpense.length - 20;

                    const cleanFileName = () => {
                      if (splitDocumentExpense !== "Sin documento") {
                        return (
                          splitDocumentExpense.slice(0, start) +
                          splitDocumentExpense.slice(start + 16)
                        );
                      } else {
                        return splitDocumentExpense;
                      }
                    };

                    const result = cleanFileName();
                    const expensesDate = new Date(item.date).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    });

                    return (
                      <tr key={item.id}>
                        <td>{item.description}</td>
                        <td>{expensesDate}</td>
                        <td>{item.balance}</td>
                        <td>{item.contractor?.name} </td>
                        <td>{result}</td>
                        <td style={{ whiteSpace: "nowrap", display: splitDocumentExpense === "Sin documento" ? "none" : "block" }}>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => showDocument(item.document.id)}
                            disabled={item.status === 'cerrado'}
                          >
                            Ver Factura
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Formulario para añadir gastos */}
            {showFormExpenses && (
              <NewExpensesForm
                apartmentId={parseInt(theId)}
                token={store.token}
                onSuccess={() => {
                  handleget_expenses_by_apartmet();
                  setShowFormExpenses(false);
                  setShowbotton(true);

                }}
                onCancel={() => {
                  setShowFormExpenses(false);
                  setShowbotton(true);
                }}
              />
            )}

            {showBotton && (
              <button
                className="btn btn-success mt-3"
                style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                  display: showBotton ? "inline-block" : "none"
                }}
                onClick={() => {
                  setShowFormExpenses(true);
                  setShowbotton(false);
                }}
              >
                Añadir Gasto
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViviendasAssoc;
