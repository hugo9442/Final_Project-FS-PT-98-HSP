import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js";
import { useState } from "react";



const NewApartmentForm = ({ onSuccess, onCancel}) => {
  const { store, dispatch } = useGlobalReducer();
  const [propietarioId, setPropietarioId] = useState('');
  const [apartmenttype, setApartmenttype] = useState('');
 

  const handleChange = (e) => {
    setPropietarioId(e.target.value);
    
  };
   const handletype = (e) => {
    setApartmenttype(e.target.value);
   
  };

  const handleCreateApartment = async () => {
    try {
      
      const response = await apartments.create_apartment(
        store.address,
        store.postal_code,
        store.city,
        store.parking_slot,
        apartmenttype,
        store.is_rent,
        propietarioId,
        store.token
      );

      if (response.msg === "La vivienda se ha registrado con exito") {

        swal({
          title: "VIVIENDA",
          text: `${response.msg}`,
          icon: "success",
          buttons: true,
        });

        onSuccess(); // Ejecutar callback tras éxito

      } else {
        swal({
          title: "ERROR",
          text: response.error || "No se pudo registrar la vivienda.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }

    } catch (error) {
      console.error("Error inesperado al crear la vivienda:", error);
      swal({
        title: "ERROR",
        text: "Ha ocurrido un error inesperado.",
        icon: "error",
        buttons: true,
        dangerMode: true,
      });
    }
  };
  console.log(apartmenttype)
  console.log(store)
  return (
    <div className="form mt-2" style={{ textTransform: "capitalize" }}>
      <div className="mb-3 row">
        <div className="col-md-4" mb-3>
          <label htmlFor="address" className="form-label">Dirección</label>
          <input type="text" className="form-control" id="address" onChange={(e) => dispatch({ type: "address", value: e.target.value })} required />
        </div>
        <div className="col-md-4" mb-3>
          <label htmlFor="postal_code" className="form-label">Código Postal</label>
          <input type="text" className="form-control" id="postal_code" onChange={(e) => dispatch({ type: "postal_code", value: e.target.value })} required />
        </div>
        <div className="col-md-4" mb-3>
          <label htmlFor="city" className="form-label">Ciudad</label>
          <input type="text" className="form-control" id="city" onChange={(e) => dispatch({ type: "city", value: e.target.value })} required />
        </div>
      </div>
      <div className="mb-3 row">
        <div className="col-4" mb-3>
          <label htmlFor="tipoVivienda" className="form-label">Tipo de Vivienda</label>
           <select
            name="tipoVivienda"
            className="form-control"
            onChange={handletype}
            required
          >
            <option value=""></option>
            <option value="VIVIENDA">VIVIENDA</option>
            <option value="BAJO">BAJO</option>
            <option value="TRASTERO">TRASTERO</option>
            <option value="ALMACEN">ALMACEN</option>
            
          </select>
        </div>
        <div className="col-md-4" mb-3>
          <label htmlFor="parking_slot" className="form-label">Plaza de Garage</label>
          <input type="text" className="form-control" id="parking_slot" onChange={(e) => dispatch({ type: "parking_slot", value: e.target.value })} required />
        </div>
      </div>
      <div className="col-md-12 mb-3">
        <label htmlFor="propietario" className="form-label">Propietario</label>
        <select
          className="form-select" 
          id="propietario"
          value={propietarioId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un propietario</option>
          {store.user?.map(propietario => (
            <option key={propietario.id} value={propietario.id}>
              {propietario.first_name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-success me-2" onClick={handleCreateApartment}>Guardar</button>
      <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default NewApartmentForm;