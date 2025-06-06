import React from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import {Asociations} from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";

const Alquileres = () => {

  const { store, dispatch } = useGlobalReducer();
 

  
 const fetchData = async () => {
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
  };

  useEffect(() => {

    fetchData();
  }, []);


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
              <h2>Gestión de Inquilinos</h2>
              <p>Aquí puedes visualizar, cargar o gestionar inquilinos activos.</p>
              <div className="tenantContracts" style={{ display: `${store.vista2}` }}>
              

                <div className="map" >
                  <h3>CONTRATOS PENDIENTES DE ASIGNAR VIVIENDA</h3>

                  <ul className="list-group">

                    {store && store.asociation.map((item) => {
                     
                  
                      const startDate = new Date(item.asociaciones[0].contract.start_date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        });
                      
                        return (
                          <li
                            key={item.asociaciones[0].assoc_id}
                            className="list-group-item d-flex justify-content-between contenedor">
                               
                            <div className="contratitem">
                              <h5>Tu Contrato con:</h5>
                              <p>INQUILINO</p>
                              <p> NOMBRE: {item.asociaciones[0].tenant.first_name}, {item.asociaciones[0].tenant.last_name} y de fecha  {startDate} </p>
                               <p>VIVIENDA</p>
                               <p>Dirección:{item.asociaciones[0].apartment.address}, CP:{item.asociaciones[0].apartment.postal_code}, Ciudad:{item.asociaciones[0].apartment.city}  </p>
                            </div>
                          </li>
                        );
                      })}    
                  </ul>
        
                </div>
               
             
               
              </div>
            </div>
            <button className="btn btn-info mt-2">Crear Alquiler</button>
                <button className="btn btn-info mt-2 mi-button"
                  onClick={() => {
                    dispatch({
                      type: "vista",
                      value: "none",
                    })
                    dispatch({
                      type: "vista2",
                      value: "",
                    })
                  }}>volver</button>
          </div>
           
      </div>
        </div>


    </>
  );
};

 export default Alquileres;