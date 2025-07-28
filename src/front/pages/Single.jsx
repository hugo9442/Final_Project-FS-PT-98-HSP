import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import MenuLateral from "../components/MenuLateral";
import { apartments } from "../fecht_apartment.js"
import NewActionForm from "../components/NewActionForm.jsx";
import { Issues } from "../fecht_issues.js";
import ModifyExpensesDocumentsbyAction from "../components/ModifyExpensesDocumentsbyActions.jsx";



export const Single = props => {
  const { theId } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [showForm, setShowForm] = useState(null);
  const [showFormExp, setShowFormExp] = useState(null);

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

  useEffect(() => {
    handlegetIssuesActionsByapartmetId();
  }, []);

  const CloseIsusses = async (item) => {
    try {
      const data = await Issues.CloseIssues(item, store.token)
      console.log(data)
      handlegetIssuesActionsByapartmetId();
    } catch (error) {
      console.log("error")
    }

  }
  console.log(store)

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Actuaciones</h2>
              <div className="form mt-2">
                <h1>Vivienda</h1>
                <p><strong>Dirección:</strong> {store.singleIssues.address}, <strong>CP:</strong> {store.singleIssues.postal_code}, <strong>Ciudad:</strong> {store.singleIssues.city}</p>

                <ul className="list-group mt-2">
                  <h2>Incidencias</h2>
                  {
                    store && store.singleIssues.issues && store.singleIssues.issues.map((item) => {

                      item.status === "cerrado" ? "bg-danger text-white" : "bg-info text-black";

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
                            <p><strong>Incidencia:</strong> {item.title} <strong>Fecha de apertura:</strong> {startDate}, <strong>Estado:</strong>  <span className={`badge ${item.status === "cerrado" ? "bg-success text-black" : "bg-danger text-white"}`}>
                              {item.status}
                            </span></p>
                            <p><strong>Descripción:</strong> {item.description}</p>
                          </div>

                          <h5 className="mt-3">Actuaciones</h5>

                          <ul className="list-group">
                            {item.actions && item.actions.map((action) => {
                              const splitBill = action.documents[0]?.file_url ? action.documents[0].file_url.split("/").pop() : 'Sin documento';
                              const start = splitBill.length - 20;
                              const result = splitBill !== "Sin documento"
                                ? splitBill.slice(0, start) + splitBill.slice(start + 16)
                                : splitBill;
                              return (
                                <li key={action.action_id} className="list-group-item">
                                  <p><strong>Titulo:</strong> {action.action_name}, <strong>Contratista:</strong> {action.contractor.id},{action.contractor.name}, <strong>Fecha:</strong> {new Date(action.start_date).toLocaleDateString("es-ES")} {''}
                                    <strong>Importe:</strong> {action.expenses[0]?.received_invoices || "No tiene coste"}, <strong>Ver Factura</strong> {splitBill}  </p>
                                  <p><strong>Descripcion:</strong> {action.description}  </p>
                                  <button className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={() => setShowFormExp(action.action_id)}
                                    style={{ display: !action.expenses[0]?.received_invoices && splitBill ? "block" : "none" }}
                                    disabled={item.status === 'cerrado'}>Añadir Factura e Importe</button>
                                  {showFormExp === action.action_id && (
                                    <ModifyExpensesDocumentsbyAction
                                      issueId={item.issue_id}
                                      contractorId={action.contractor?.id}
                                      actionId={contractor}
                                      apartmentId={store.singleIssues.id}
                                      token={store.token}
                                      onSuccess={() => {
                                        setShowForm(null);
                                        handlegetIssuesActionsByapartmetId();
                                      }}
                                      onClose={() => setShowFormExp(false)}
                                    />
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                          <div className="row">
                            <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => setShowForm(item.issue_id)} disabled={item.status === 'cerrado'}>Añadir actuación</button>
                            <button className="btn btn-sm btn-outline-primary mt-2"
                              onClick={() => { CloseIsusses(item.issue_id) }} disabled={item.status === 'cerrado'}>
                              <strong>Cerrar Incidencia</strong>
                            </button>
                            {showForm === item.issue_id && (
                              <NewActionForm
                                issueId={item.issue_id}
                                apartmentId={store.singleIssues.id}
                                token={store.token}
                                onSuccess={() => {
                                  setShowForm(null);
                                  handlegetIssuesActionsByapartmetId();
                                }}
                                onClose={() => setShowForm(false)}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Single.propTypes = {
  match: PropTypes.object
};
