
import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { format, differenceInDays } from 'date-fns';
import MenuLateral from "../components/MenuLateral";
import { issues } from "../feych_issues.js";


const Incidencias = () => {
  const { store, dispatch } = useGlobalReducer();
  const [itpartment, setItapartment] = useState()
const fetchApartments = async () => {
      try {
  
        const data = await users.getUserApartments(store.todos.id, store.token);
        if (data.msg==="ok") {
          dispatch({ type: "add_apartments", value: data.apartments });
        }
      } catch (error) {
        
      };
       try {
  
        const data = await users.getUserIssue(store.todos.id, store.token);
        if (data.msg==="ok") {
          dispatch({ type: "add_issues", value: data.issues });
        }
      } catch (error) {
        
      }

    };
     
 useEffect(()=>{
   fetchApartments()
 }, [])


  const handlesIssues = async () => {
    try { const data = await issues.create_issue(store.title, store.description, store.status, itpartment, 
                        store.priority, store.type, store.contract_start_date, store.token )
      if (data.msg){
        swal({ title: "ÉXITO", text:`${data.msg}`, icon: "success" });
        dispatch({type:"add_issues", value:data.isue})
      }else{
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

  const Cissue =async()=>{
  await handlesIssues()
 }
 console.log(store)


  return (
    <>


      <div className="container-fluid mt-4">
        <div className="row">
          {/* Menú lateral */}
          <MenuLateral setActiveOption={() => { }} />

          {/* Contenido principal */}
          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Incidencias</h2>
              <p>Aquí puedes visualizar, cargar o gestionar incidencias activas.</p>
              <div className="map" style={{ display: `${store.vista}` }}>
                <ul className="list-group">
                  {
                    store && store.apartments.map((item) => {
                      const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      return (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between contenedor">
                            <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" 
                               type="checkbox" value="" id="checkDefault"onClick={(e)=>{setItapartment(item.id)} }/></div>
                          <div className="contratitem">
                            <p>Dirección: {item.address},CP: {item.postal_code}, Ciudad: {item.city}, Parking: {item.parking_slot}, Estado: {alquilado}</p>
                          </div>
                        </li>
                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <h1>Todavía no has registrado ninguna vivienda</h1>
                    )}
                </ul>
                <h1>Selecciona una vivienda para añadir incidencia</h1>
                <div className="mb-3">
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
                <div className="mb-3">
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

                <div className="mb-3">
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
                <div className="mb-3">
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
                <div className="mb-3">
                  <label htmlFor="postal_code" className="form-label">
                    Descripciom
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

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    Estado
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Estado"
                    onChange={(e) =>
                      dispatch({ type: "addstatus", value: e.target.value })
                    }
                  />
                </div>
                 <button className="btn btn-success mt-2"
                  onClick={Cissue}>Crear Incidencia</button>
                <button className="btn btn-success mt-2"
                  onClick={(e) => {
                    dispatch({
                      type: "vista",
                      value: "none",
                    })
                    dispatch({
                      type: "vista2",
                      value: "",
                    })
                  }}>Volver a Incidencia</button>
              </div>
              <div className="form" style={{ display: `${store.vista2}` }}>
                <h1>Incidencias abiertas por vivienda</h1>
                <ul className="list-group">
                  {
                    store && store.issues.map((item) => {
                      const alquilado = !item.apartment.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                       const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        });
                      return (
                        <li
                          key={item.apartment_id}
                          className="list-group-item d-flex justify-content-between contenedor">
                            <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" 
                               type="checkbox" value="" id="checkDefault"onClick={(e)=>{setItapartment(item.id)} }/></div>
                          <div className="contratitem">
                            <p>Dirección: {item.apartment.address},CP: {item.apartment.postal_code}, Ciudad: {item.apartment.ccity}, Estado: {alquilado}</p>
                            <p>Incidencia: {item.title}</p>
                             <p>Fecha de apertura: {startDate}, Estado: {item.status}</p>
                             <p>Descripcion: {item.description} </p>
                          </div>
                        </li>
                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <h1>Todavía no has registrado ninguna vivienda</h1>
                    )}
                </ul>
                
                
                <button className="btn btn-success mi-button"
                  onClick={() => {

                    dispatch({
                      type: "vista",
                      value: "",
                    })
                    dispatch({
                      type: "vista2",
                      value: "none",
                    })

                    
                  }}>Abrir Actuacion</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Incidencias;