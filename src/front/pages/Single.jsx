
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";  // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state

import React from "react";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import { useEffect, useState } from "react";
import { format, differenceInDays } from 'date-fns';
import MenuLateral from "../components/MenuLateral";


export const Single = props => {

  const { store } = useGlobalReducer()


  const { theId } = useParams()
  const singleTodo = store.issues.find(todo => todo.apartment.apartment_id === parseInt(theId));
 console.log(store.isuues.apartment.apartment_id )
  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <MenuLateral setActiveOption={() => { }} />
          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Incidencias</h2>
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
                    singleTodo && singleTodo.map((item) => {
                      const alquilado = !item.apartment.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      });
                      return (

                        <li
                          key={item.apartment_id}
                          className="list-group-item d-flex  contenedor">
                         
                          <div className="contratitem">
                            <p><strong>Dirección: </strong>{singleTodo.apartment.address}, <strong>CP:</strong> {item.apartment.postal_code}, <strong>Ciudad:</strong> {item.apartment.city}, <strong>Estado:</strong> {alquilado}</p>
                            <p><strong>Incidencia: </strong>{item.title} <strong>Fecha de apertura: </strong>{startDate}, <strong>Estado:</strong> {item.status}</p>
                            <p><strong>Descripcion: </strong>{item.description} </p>
                            <Link to={"/single/" + item.apartment_id}>Link to: {item.title} </Link>
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

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
Single.propTypes = {
  // Although 'match' prop is defined here, it is not used in the component.
  // Consider removing or using it as needed.
  match: PropTypes.object
};
