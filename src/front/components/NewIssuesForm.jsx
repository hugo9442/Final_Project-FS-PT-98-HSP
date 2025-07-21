import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Issues } from "../fecht_issues.js";
import swal from "sweetalert";


const NewFormIssues = ({ apartmentId,tenant_name, address, onSuccess, onCancel }) => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (tenant_name){
      try {
      const data = await Issues.create_issue_by_tenant(
        store.title,
        store.description,
        store.status,
        apartmentId,
        store.priority,
        store.type,
        store.contract_start_date,
        store.contract_end_date,
        tenant_name,
        address,
        store.token
      );

      if (data.msg) {
        swal("ÉXITO", data.msg, "success");
        onSuccess && onSuccess();
      } else {
        swal("ERROR", data.error || "Algo salió mal", "warning");
      }
    } catch (error) {
      swal("ERROR", error.message || "Error inesperado", "error");
    } finally {
      setLoading(false);
    }
    }else{
       try {
      const data = await Issues.create_issue(
        store.title,
        store.description,
        store.status,
        apartmentId,
        store.priority,
        store.type,
        store.contract_start_date,
        store.contract_end_date,
        store.token
      );

      if (data.msg) {
        swal("ÉXITO", data.msg, "success");
        onSuccess && onSuccess();
      } else {
        swal("ERROR", data.error || "Algo salió mal", "warning");
      }
    } catch (error) {
      swal("ERROR", error.message || "Error inesperado", "error");
    } finally {
      setLoading(false);
    }
 }
  };

  return (
    <div className="p-3 border rounded bg-white mt-2">
    <form onSubmit={handleSubmit} className="formIncidencia mt-2">
      <h3 className="mt-2 mb-2">Formulario de Creación de Incidencia</h3>
       <div className="formIncidenciadata">
      <div className="mb-1">
        <label htmlFor="Titulo" className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          id="Titulo"
          onChange={(e) => dispatch({ type: "addTitle", value: e.target.value })}
        />
      </div>

      <div className="mb-1">
        <label htmlFor="start_day_issue" className="form-label">Fecha de Inicio</label>
        <input
          type="date"
          className="form-control"
          id="start_day_issue"
          onChange={(e) => dispatch({ type: "addstart_date", value: e.target.value })}
        />
      </div>

      <div className="mb-1">
        <label htmlFor="end_day_issue" className="form-label">Fecha de Fin</label>
        <input
          type="date"
          className="form-control"
          id="end_day_issue"
          onChange={(e) => dispatch({ type: "addend_date", value: e.target.value })}
        />
      </div>

      <div className="mb-1">
        <label htmlFor="Clase" className="form-label">Clase</label>
        <input
          type="text"
          className="form-control"
          id="Clase"
          onChange={(e) => dispatch({ type: "addtype", value: e.target.value })}
        />
      </div>

      <div className="mb-1">
        <label htmlFor="Estado" className="form-label">Estado</label>
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
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <textarea
          className="form-control"
          id="descripcion"
          rows="3"
          onChange={(e) => dispatch({ type: "adddescription", value: e.target.value })}
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="btn btn-success mt-2"
        disabled={loading}
        style={{ color: "black", backgroundColor: "rgba(138, 223, 251, 0.8)" }}
      >
        <strong>{loading ? "Guardando..." : "Crear Incidencia"}</strong>
      </button>

      <button
        type="button"
        className="btn btn-secondary mt-2 ms-2"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </form>

    </div>
  );
};

export default NewFormIssues;
