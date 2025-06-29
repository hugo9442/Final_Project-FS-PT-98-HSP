
import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { format, differenceInDays } from 'date-fns';
import MenuLateral from "../components/MenuLateral";
import { Issues } from "../fecht_issues.js";
import { Link } from "react-router-dom";
import { apartments } from "../fecht_apartment.js";
import NewFormIssues from "../components/NewIssuesForm.jsx";


const Incidencias = () => {
  const { store, dispatch } = useGlobalReducer();
  const [itpartment, setItapartment] = useState()
  const [showForm, setShowForm] = useState(false);

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
    };

    try {

      const data = await users.getUserIssueAll(store.token);
      console.log(data)
      if (data.msg) {
        dispatch({ type: "add_issues", value: data.issues })
      }
    } catch (error) {

    }

  };

  useEffect(() => {
    if (store.todos?.id && store.token) {
      fetchApartments();
    }
  }, [store.todos, store.token])


  const handlesIssues = async () => {
    try {
      const data = await Issues.create_issue(store.title, store.description, store.status, itpartment,
        store.priority, store.type, store.contract_start_date, store.contract_end_date, store.token)
      if (data.msg) {
        swal({ title: "ÉXITO", text: `${data.msg}`, icon: "success" });
        //dispatch({ type: "add_issues", value: data.issues })
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

    try {

      const data = await users.getUserIssue(store.todos.id, store.token);

      if (data.msg) {
        dispatch({ type: "add_issues", value: data.issues })
      }
    } catch (error) {

    }

  };

  const Cissue = async () => {
    await handlesIssues()
  }
  const getDaysBadgeClass = (alquilado) => {
    if (alquilado === "Pendiente de Alquilar") return "bg-danger text-white";
    if (alquilado === "Alquilado") return "bg-info text-black";
    return "bg-success text-white";
  };

  const getStatusBadgeClass = (status) => {
    if (status !== "cerrado") return "bg-danger text-white";
    if (status === "cerrado") return "bg-success text-black";
    return "bg-success text-white";
  };
  console.log(store)

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">

          <div className="col-md-12">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Incidencias</h2>
              <h5>Seleccione una Vivienda para añadir una Incidencia</h5>
              <div className="map" style={{ display: `${store.vista}` }}>
                <ul className="list-group">
                  {
                    store && store.apartments.map((item) => {
                      const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      return (
                        <li
                          key={item.id}
                          className="list-group-item d-flex  contenedor">
                          <div className="mi-div p-3 mb-2 bg-info text-dark" ><input className="form-check-input"
                            type="checkbox" value="" id="checkDefault" onClick={(e) => { setItapartment(item.id) }} /></div>
                          <div className="contratitem">
                            <p><strong>Dirección</strong>: {item.address}, <strong>CP:</strong>: {item.postal_code}, <strong>Ciudad</strong>: {item.city}    <span className={`badge ${getDaysBadgeClass(alquilado)}`}>{alquilado}</span></p>
                          </div>
                        </li>
                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <h1>Todavía no has registrado ninguna vivienda</h1>
                    )}
                </ul>

                <div className="formIncidencia mt-2">
                  <h3 className="mt-2, mb-2">Formulario de Creación de Incidencia</h3>
                  <div className="formIncidenciadata">
                    <div className="mb-1">
                      <label htmlFor="Titulo" className="form-label">
                        Titulo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Titulo"
                        onChange={(e) =>
                          dispatch({ type: "addTitle", value: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-1">
                      <label htmlFor="start_day" className="form-label">
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="start_day_issue"
                        onChange={(e) =>
                          dispatch({ type: "addstart_date", value: e.target.value })}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="start_day" className="form-label">
                        Fecha de Fin
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="end_day_issue"
                        onChange={(e) =>
                          dispatch({ type: "addend_date", value: e.target.value })}
                      />
                    </div>

                    <div className="mb-1">
                      <label htmlFor="type" className="form-label">
                        Clase
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Clase"
                        onChange={(e) =>
                          dispatch({ type: "addtype", value: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-1">
                      <label htmlFor="Estado" className="form-label">
                        Estado
                      </label>
                      <select
                        className="form-control"
                        id="Estado"
                        onChange={(e) =>
                          dispatch({ type: "addstatus", value: e.target.value })
                        }
                        required
                      >
                        <option value="">Seleccione estado</option>
                        <option value="ABIERTA">ABIERTA</option>
                        <option value="CERRADA">CERRADA</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-1">
                    <label htmlFor="postal_code" className="form-label">
                      Descripción
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="descripcion"
                      onChange={(e) =>
                        dispatch({ type: "adddescription", value: e.target.value })
                      }
                    />
                  </div>


                </div>
                <button className="btn btn-success mt-2" style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",

                }}
                  onClick={Cissue}><strong>Crear Incidencia</strong></button>
                <button className="btn btn-success mt-2 mi-button" style={{
                  color: "black",
                  backgroundColor: 'rgba(228, 230, 231, 0.8)'
                }}
                  onClick={(e) => {
                    dispatch({
                      type: "vista",
                      value: "none",
                    })
                    dispatch({
                      type: "vista2",
                      value: "",
                    })
                  }}><strong >Cancelar</strong></button>
              </div>
              <div className="form mt-2" style={{
                display: `${store.vista2}`,
                maxHeight: "600px",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "10px"
              }}>
                <h1>Incidencias abiertas por vivienda</h1>
                <ul className="list-group mt-2">
                  {
                    store && store.issues.map((item) => {
                      const status = item.status
                      const alquilado = !item.apartment.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      return (

                        <li
                          key={item.issue_id}
                          className="list-group-item d-flex  contenedor">

                          <div className="contratitem">
                            <p><strong>Dirección: </strong>{item.apartment.address}, <strong>CP:</strong> {item.apartment.postal_code}, <strong>Ciudad:</strong> {item.apartment.city}, <span className={`badge ${getDaysBadgeClass(alquilado)}`}>{alquilado}</span></p>
                            <p><strong>Incidencia: </strong>{item.title} <strong>Fecha de apertura: </strong>{startDate}, <strong>Estado:</strong> {item.status} <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span></p>
                            <p><strong>Descripcion: </strong>{item.description} </p>
                            <Link to={"/single/" + item.apartment_id}>Ver incidencia: {item.title} </Link>
                          </div>
                        </li>


                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <h1>Todavía no has registrado ninguna vivienda</h1>
                    )}
                </ul>

                <button className="btn btn-success mi-button mt-2" style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                }}
                  onClick={() => {
                    dispatch({
                      type: "vista",
                      value: "",
                    })
                    dispatch({
                      type: "vista2",
                      value: "none",
                    })
                  }}><strong>Abrir Nueva Incidencia</strong></button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Incidencias;