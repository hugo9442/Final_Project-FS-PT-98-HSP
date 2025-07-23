import React, { useState, useEffect } from "react";
import { apartments } from "../fecht_apartment.js";
import { contractor } from "../fecht_contractor";
import { categories } from "../fecht_categories.js";
import { action } from "../fetch_actions.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const NewExpenseFromContractor = ({ onSubmit }) => {
  const { store, dispatch } = useGlobalReducer();
  const [step, setStep] = useState(1);
  const [categoriesList, setCategoriesList] = useState([]);
  const [actionList, setActionList] = useState([]);

  const [formData, setFormData] = useState({
    apartment_id: "",
    category_id: "",
    contractor_id: "",
    description: "",
    amount: "",
    date: "",
    file: null,
    action_id: "",
  });

  const fetchInitialData = async () => {
    try {
      const [apartmentData, contractorData, categoryData] = await Promise.all([
        apartments.getApartmentsWithOwner(store.token),
        contractor.getContractor(store.token),
        categories.getcategories(store.token),
      ]);

      if (apartmentData.msg === "ok") {
        dispatch({ type: "add_apartments", value: apartmentData.apartments });
      }

      if (contractorData.msg === "ok") {
        dispatch({ type: "add_contractor", value: contractorData.contractor });
      }

      if (categoryData.msg === "ok") {
        setCategoriesList(categoryData.categories);
      }
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleGetActionsWithoutExpensesOrDocs = async () => {
    try {
      const data = await action.getActionsWithoutExpensesOrDocs(formData.apartment_id, store.token);

      if (data.msg === "ok") {
        setActionList(data.actionlist); // <- Aquí se actualiza correctamente la lista
        return true;
      }
    } catch (error) {
      console.error("Error al cargar acciones:", error);
    }
    return false;
  };
  console.log(actionList)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };
  console.log(actionList)
  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h4 className="mb-4">Nuevo Gasto</h4>

      {/* Paso 1 */}
      {step === 1 && (
        <>
          <div className="mb-3">
            <label className="form-label">Apartamento</label>
            <select name="apartment_id" value={formData.apartment_id} onChange={handleChange} required className="form-select">
              <option value="">Selecciona un apartamento</option>
              {store.apartments?.map(a => (
                <option key={a.id} value={a.id}>{a.address}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Importe (€)</label>
            <input type="number" name="amount" step="0.01" value={formData.amount} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required className="form-control" />
          </div>

          <button
            type="button"
            onClick={async () => {
              const ok = await handleGetActionsWithoutExpensesOrDocs();
              if (ok) next();
            }}
            className="btn btn-primary"
          >
            Siguiente
          </button>
        </>
      )}

      {/* Paso 2 */}
      {step === 2 && (
        <>
          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required className="form-select">
              <option value="">Selecciona una categoría</option>
              {categoriesList?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Proveedor</label>
            <select name="contractor_id" value={formData.contractor_id} onChange={handleChange} required className="form-select">
              <option value="">Selecciona un proveedor</option>
              {store.contractor?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" onClick={back} className="btn btn-secondary">Atrás</button>
            <button type="button" onClick={next} className="btn btn-primary">Siguiente</button>
          </div>
        </>
      )}

      {/* Paso 3 */}
      {step === 3 && (
        <>
          <div className="mb-3">
            <label className="form-label">Subir documento (PDF opcional)</label>
            <input type="file" accept=".pdf" name="file" onChange={handleChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Asociar a una acción (opcional)</label>
            <select name="action_id" value={formData.action_id} onChange={handleChange} className="form-select">
              <option value="">-- Ninguna --</option>
              {actionList
                ?.sort((a, b) => a.id - b.id) 
                .map(a => (
                  <option key={a.id} value={a.id}>
                    nº{a.id}, {a.description}, de fecha {new Date(a.start_date).toLocaleDateString()}
                  </option>
                ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" onClick={back} className="btn btn-secondary">Atrás</button>
            <button type="submit" className="btn btn-success">Guardar gasto</button>
          </div>
        </>
      )}
    </form>
  );
};

export default NewExpenseFromContractor;
