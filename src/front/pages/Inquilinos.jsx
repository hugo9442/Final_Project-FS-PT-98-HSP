import React from "react";
import { users } from "../fecht_user.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { object } from "prop-types";
import NewTenantContractForm from "../components/NewTenantContractForm.jsx";


const Inquilinos = () => {
  const [itemcontract, setItemcontract] = useState()
  const [itpartment, setItapartment] = useState()
  const [ownerid, setOwnerid] = useState()
  const { store, dispatch } = useGlobalReducer();
  const [showForm, setShowForm] = useState(false);
  const [showBotton, setShowbotton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  const fetchData = async () => {
    try {

      const data = await users.getUserContracts(store.todos.id, store.token);
      if (data.msg === "ok") {
        await dispatch({ type: "add_contracts", value: data.contracts });
      }
    } catch (error) {

    }
    try {

      const data = await users.getApartmentsNotRented(store.token);
      console.log
      dispatch({ type: "add_apartments", value: data.apartments });

    } catch (error) {

    }
    try {

      const data = await Asociations.get_associations_without_apartment(store.token);

      await dispatch({ type: "add_assocnoapartments", value: data });

    } catch (error) {
    }
  };
  useEffect(() => {
    if (store.todos?.id && store.token) {
      fetchData();
    }
  }, [store.todos, store.token])


  const handleCreateRent = async () => {
    try {
      const data = await Asociations.updateasociation(itpartment, itemcontract, store.token)
      if (data.msg) {
        swal({ title: "ÉXITO", text: "Operaciones completadas", icon: "success" });
        fetchData()
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

  }

  const Crent = async () => {
    if (itemcontract && itemcontract) {
      setIsLoading(true); // Activar spinner al iniciar la acción
      try {
        await handleCreateRent();
      } catch (error) {
        console.error("Error en Crent:", error);
      } finally {
        setIsLoading(false); // Desactivar spinner cuando termine (éxito o error)
      }
    } else {
      swal({
        title: "ERROR",
        text: "Hay que seleccionar una vivienda y un contrato para crear un alquiler",
        icon: "error",
        buttons: true,
        dangerMode: true,
      });
    }

  };
  console.log("owner_id", ownerid)
  console.log(itpartment)
  console.log(store)
  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="p-4 border rounded bg-light">
              <h2>Gestión de Inquilinos</h2>
              <p>Aquí puedes visualizar, cargar o gestionar inquilinos activos.</p>

              <div className="map" >
                {isLoading && (
                  <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando contratos...</p>
                  </div>
                )}

                <div className="map" >
                  <h3>CONTRATOS PENDIENTES DE ASIGNAR VIVIENDA</h3>

                  <ul className="list-group">
                    {store && store.assocnoapartments ? (
                      store.assocnoapartments.length > 0 ? (
                        store.assocnoapartments.map((item) => {
                          const startDate = new Date(item.contract.start_date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          });

                          return (
                            <li
                              key={item.id}
                              className="list-group-item d-flex contenedor"
                            >
                              <div className="mi-div p-3 mb-2 bg-info text-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="checkDefault"
                                  onClick={(e) => { setItemcontract(item.id) }}
                                />
                              </div>
                              <div className="contratitem">
                                <h5>Tu Contrato con:</h5>
                                <p>Inquilino: {item.tenant.first_name}, {item.tenant.last_name} y de fecha {startDate}</p>
                                <p>No tiene vivienda asignada. Puedes asignarle una de las viviendas que están más abajo.</p>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <p>No hay contratos pendientes de asignar</p>
                      )
                    ) : (
                      <p>Cargando...</p>
                    )}
                  </ul>

                </div>
                <div className="map" >
                  <h3>VIVIENDAS</h3>
                  <ul className="list-group">
                    {store && store.apartments?.map((item) => {
                      const alquilado = !item.is_rent ? "Pendiente de Alquilar" : "Alquilado";
                      return (
                        <li
                          key={item.id}
                          className="list-group-item d-flex contenedor">
                          <div className="mi-div p-3 mb-2 bg-info text-dark"><input className="form-check-input" type="checkbox" value=""
                            id="checkDefault" onClick={() => { setItapartment(item.id); setOwnerid(item.owner_id); }} /></div>
                          <div className="contratitem">
                            <p>Dirección: {item.address}, CP: {item.postal_code}, Ciudad: {item.city}, Parking: {item.parking_slot}, Propietario:{item.owner_name}</p>
                          </div>
                        </li>
                      );
                    })}{(!store.apartments || store.apartments.length === 0) && (
                      <p>Todas las viviendas están alquiladas</p>
                    )}
                  </ul>
                  {showForm && (
                    <NewTenantContractForm
                      onSuccess={() => {
                        setShowForm(false);
                        setShowbotton(true);
                      }}
                      onCancel={() => { setShowForm(false), setShowbotton(true) }}
                    />
                  )}
                </div>
                {showBotton && (

                  <button className="btn mt-2" style={{
                    color: "black",
                    backgroundColor: 'rgba(138, 223, 251, 0.8)',
                    textDecoration: "strong",

                  }}
                    onClick={() => { setShowForm(true), setShowbotton(false) }}>Añadir Inquilino y Contrato</button>

                )}
                <button className="btn mt-2" style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                  marginLeft: "10px", display: showBotton ? "inline-block" : "none"
                }}

                  onClick={Crent}>Crear Alquiler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inquilinos;