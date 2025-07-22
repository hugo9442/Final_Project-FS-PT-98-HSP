import React, { useState, useEffect } from "react";
import { apartments } from "../fecht_apartment.js";
import { contractor } from "../fecht_contractor.js";
import { categories } from "../fecht_categories.js";
import { action } from "../fetch_actions.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Urlexport } from "../urls.js";

const NewExpensesForm = ({ apartmentId, onSubmit, onCancel, onSuccess }) => {
  const { store, dispatch } = useGlobalReducer();
  const [step, setStep] = useState(1);
  const [categoriesList, setCategoriesList] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    apartment_id: apartmentId,
    category_id: "",
    contractor_id: "",
    description: "",
    amount: "",
    date: "",
    file: null,
    action_id: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [contractorData, categoryData] = await Promise.all([
          contractor.getContractor(store.token),
          categories.getcategories(store.token),
        ]);

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
    fetchInitialData();
  }, []);

  const handleGetActionsWithoutExpensesOrDocs = async () => {
    try {
      const data = await action.getActionsWithoutExpensesOrDocs(formData.apartment_id, store.token);
      if (data.msg === "ok") {
        setActionList(data.actionlist);
        return true;
      }
    } catch (error) {
      console.error("Error al cargar acciones:", error);
    }
    return false;
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "amount") {
      const normalized = value.replace(",", ".");
      if (/^\d*\.?\d*$/.test(normalized)) {
        setFormData((prev) => ({ ...prev, [name]: normalized }));
      }
    } else if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError({ amount: "El importe debe ser un número mayor que 0" });
      return;
    }

    setError({});
    let documentId = null;

    try {
      // Subir documento si existe
      if (formData.file) {
        const docForm = new FormData();
        docForm.append("description", formData.description);
        docForm.append("apartment_id", apartmentId);
        docForm.append("contractor_id", formData.contractor_id);
        docForm.append("action_id", formData.action_id);
        docForm.append("file", formData.file);
       console.log(docForm)
        const docRes = await fetch(`${Urlexport}/upload`,
        
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
            body: docForm,
          }
        );

        const docData = await docRes.json();
        if (!docRes.ok) {
          console.error("Error creando documento:", docData);
        } else {
          documentId = docData.document?.id;
        }
      }

      const expensePayload = {
        description: formData.description,
        date: formData.date,
        received_invoices: formData.amount,
        apartment_id: apartmentId,
        contractor_id: formData.contractor_id,
        category_id: formData.category_id,
        action_id:  formData.action_id !== "" ? parseInt(formData.action_id) : null,
        document_id: documentId || null,
      };

      const expenseRes = await fetch( `${Urlexport}/create`,
       
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.token}`,
          },
          body: JSON.stringify(expensePayload),
        }
      );

      const expenseData = await expenseRes.json();
      if (!expenseRes.ok) {
        console.error("Error creando gasto:", expenseData);
      }

      onSuccess();
      onCancel();
      handleget_expenses_by_apartmet();
    } catch (err) {
      console.error("Error general:", err);
    }
  };
  const handleget_expenses_by_apartmet = async () => {
      try {
        const data = await expenses.get_expenses_by_apartmet(parseInt(theId), store.token);
        if (!data.error) {
          dispatch({ type: "add_expenses", value: data.expenses });
        }
      } catch (error) {
        console.error("Error fetching issues/actions:", error);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
      <h4 className="mb-4">Nuevo Gasto</h4>

      {/* Paso 1 */}
      {step === 1 && (
        <>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Importe (€)</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className={`form-control ${error.amount ? "is-invalid" : ""}`}
            />
            {error.amount && <div className="invalid-feedback">{error.amount}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required className="form-control" />
          </div>

          <div className="d-flex justify-content-between">
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
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Paso 2 */}
      {step === 2 && (
        <>
          <div className="mb-3">
            <label className="form-label">Categoría</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required className="form-select">
              <option value="">Selecciona una categoría</option>
              {categoriesList?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Proveedor</label>
            <select name="contractor_id" value={formData.contractor_id} onChange={handleChange} required className="form-select">
              <option value="">Selecciona un proveedor</option>
              {store.contractor?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" onClick={back} className="btn btn-secondary">
              Atrás
            </button>
            <button type="button" onClick={next} className="btn btn-primary">
              Siguiente
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
              Cancelar
            </button>
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
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    nº{a.id}, {a.description}, {new Date(a.start_date).toLocaleDateString()}
                  </option>
                ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" onClick={back} className="btn btn-secondary">
              Atrás
            </button>
            <button type="submit" className="btn btn-success">
              Guardar gasto
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default NewExpensesForm;
