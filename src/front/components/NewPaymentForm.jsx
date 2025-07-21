import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const NewPaymentForm = ({ token, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({ expense_id: "", amount: "", date: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { store } = useGlobalReducer();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://sample-service-name-bnt3.onrender.com/expensespayments/create",
        //"https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/expensespayments/create", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
           expense_id: parseInt(formData.expense_id),
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Gasto</label>
        <select
          className="form-select"
          name="expense_id"
          value={formData.expense_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona un gasto --</option>
          {store.contractorexpenses
            ?.filter(e => (e.received_invoices - (e.payed_invoice || 0)) > 0)
            .map(e => (
              <option key={e.id} value={e.id}>
                {new Date(e.date).toLocaleDateString("es-ES")} - {e.description} ({(e.received_invoices - (e.payed_invoice || 0)).toFixed(2)} € pendiente)
              </option>
            ))
          }
        </select>
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
