import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Urlexport } from "../urls.js";
//import { itemAxisPredicate } from "recharts/types/state/selectors/axisSelectors.js";

const NewPaymentForm = ({ id, token, onSuccess, onClose }) => {
  console.log(id)
  const [formData, setFormData] = useState({ expense_id: id, amount: "", date: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { store } = useGlobalReducer();
 const expense=(id)=>{
   return store.contractorexpenses?.find(e => e.id===parseInt(id))
  }
const formExpense=expense(id)



  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
 
    try {
      const res = await fetch(`${Urlexport}/expensespayments/create`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
           expense_id: parseInt(id),
           amount: parseFloat(formData.amount),
           payment_date: formData.date,       
          }),
        }
      );

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || "Error al registrar el pago");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
console.log(store.contractorexpenses)
  return (
    <form onSubmit={handleSubmit}>
      <div className="justify-items-center mb-3">
        <label className="form-label"> {new Date(formExpense.date).toLocaleDateString("es-ES")} - {formExpense.description} ({formExpense.balance.toFixed(2)} € pendiente)</label>
      </div>
      <div className="mb-3">
        <label className="form-label">Importe del pago</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0.01"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
     
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="modal-footer">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewPaymentForm;
