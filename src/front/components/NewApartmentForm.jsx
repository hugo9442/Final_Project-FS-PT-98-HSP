import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js";

const NewApartmentForm = ({ onSuccess, onCancel }) => {
  const { store, dispatch } = useGlobalReducer();

  const handleCreateApartment = async () => {
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

      if (data.msg === "La vivienda se ha registrado con exito") {
        dispatch({ type: "add_apartments", value: data.apartments });
        swal({
          title: "VIVIENDA",
          text: `${data.msg}`,
          icon: "success",
          buttons: true,
        });
        onSuccess();
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
    }
  };

  return (
    <div className="form">
      <div className="mb-3">
        <label htmlFor="address" className="form-label">Dirección</label>
        <input type="text" className="form-control" id="address" onChange={(e) => dispatch({ type: "address", value: e.target.value })} />
      </div>
      <div className="mb-3">
        <label htmlFor="postal_code" className="form-label">Código Postal</label>
        <input type="text" className="form-control" id="postal_code" onChange={(e) => dispatch({ type: "postal_code", value: e.target.value })} />
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">Ciudad</label>
        <input type="text" className="form-control" id="city" onChange={(e) => dispatch({ type: "city", value: e.target.value })} />
      </div>
      <div className="mb-3">
        <label htmlFor="parking_slot" className="form-label">Plaza de Garage</label>
        <input type="text" className="form-control" id="parking_slot" onChange={(e) => dispatch({ type: "parking_slot", value: e.target.value })} />
      </div>
      <button className="btn btn-success me-2" onClick={handleCreateApartment}>Guardar</button>
      <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default NewApartmentForm;