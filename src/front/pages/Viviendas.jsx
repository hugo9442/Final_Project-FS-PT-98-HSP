import React from "react";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MenuLateral from "../components/MenuLateral";
import { useState, useEffect } from "react";
import NewApartmentForm from "../components/NewApartmentForm.jsx";
import { useNavigate } from "react-router-dom";

const Viviendas = () => {
  const [showForm, setShowForm] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const [item, setItem] = useState()
  const navigate=useNavigate()


  

  const fetchApartments = async () => {
    try {

      const data = await users.getUserApartments(store.todos.id, store.token);
      if (data.msg === "ok") {
        dispatch({ type: "add_apartments", value: data.apartments });
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchApartments()
  }, [])



  const handleCreatapartment = async () => {
    try {
      const data = await apartments.create_apartment(
        store.address,
        store.postal_code,
        store.city,
        store.parking_slot,
        store.is_rent,
        store.todos.id,
        store.token
      );
      console.log(data);
      console.log(data.error);
      if (data.msg === "La vivienda se ha registrado con exito") {
        dispatch({ type: "add_apartments", value: data.apartments });
        swal({
          title: "VIVIENDA",
          text: `${data.msg}`,
          icon: "success",
          buttons: true,
        });
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
      console.log(error);
      return error;
    }
  };
  

  const Capratment = async () => {
    await handleCreatapartment();
  };
  const getDaysBadgeClass = (alquilado) => {
    if (alquilado==="Pendiente de Alquilar"){ return 'bg-danger text-white'};
    if (alquilado==="Alquilado") {return 'bg-info text-black'};
    return 'bg-success text-white';
  };
 


  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
         
          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Viviendas</h2>
              <p>
                Aquí puedes visualizar, cargar o gestionar viviendas activas.
              </p>
              <div className="map">
                <ul className="list-group">
                  {
                    store && store.apartments.map((item) => {
                       
                      const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      return (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between" >
                           
                          <div className="contratitem" onClick={()=>{navigate('/Viviendasassoc/'+item.id)}}  style={{ cursor: "pointer" }}>
                            <p><strong>Dirección:</strong> {item.address}, <strong>CP:</strong> {item.postal_code}, <strong>Ciudad:</strong> {item.city}, <strong>Parking:</strong> {item.parking_slot},    <span className={`badge ${getDaysBadgeClass(alquilado)}`}>{alquilado}</span> </p> 
                           
                          </div>

                        </li>
                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <h1>Todavía no has registrado ninguna vivienda</h1>
                    )}
                </ul>
                {showForm && (
                  <NewApartmentForm
                    onSuccess={() => {
                      setShowForm(false);
                      fetchApartments();
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                )}
                <button className="btn btn-success mt-2" onClick={() => setShowForm(true)}>
                  Añadir Vivienda
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Viviendas;
