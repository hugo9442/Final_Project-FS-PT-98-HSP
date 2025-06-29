// components/NewActionForm.jsx
import React, { useState } from "react";
import storeReducer from "../store";

const NewActionForm = ({ issueId, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    status: "",
    action_name: "",
    start_date: "",
    description: "",
    contractor: "",
    bill_amount: "",
    bill_image: "",
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append("status", formData.status);
      dataToSend.append("action_name", formData.action_name);
      dataToSend.append("start_date", formData.start_date);
      dataToSend.append("description", formData.description);
      dataToSend.append("contractor", formData.contractor);
      dataToSend.append("bill_amount", formData.bill_amount);
      dataToSend.append("issue_id", issueId);
      if (formData.bill_image) {
        dataToSend.append("bill_image", formData.bill_image);
      }

      const res = await fetch(`https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/actions/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: dataToSend
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Error:", data.msg);
      }
    } catch (err) {
      console.error(err);
    }
  };


console.log(formData)
  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white mt-2">
      <div className="row">
        <div className="col-md-6">
          <input name="action_name" placeholder="Nombre de actuación" className="form-control mb-2" onChange={handleChange} required />
          <input name="contractor" placeholder="Contratista" className="form-control mb-2" onChange={handleChange} required />
          <input name="start_date" type="date" className="form-control mb-2" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <select
            name="status"
            className="form-control mb-2"
            onChange={handleChange}
            required
          >
            <option value="">Estado</option>
            <option value="ABIERTA">ABIERTA</option>
            <option value="CERRADA">CERRADA</option>
          </select>
          <input name="bill_amount" placeholder="Importe de factura" type="number" className="form-control mb-2" onChange={handleChange} required />
          <input name="bill_image" type="file" accept="application/pdf" placeholder="URL de imagen factura" className="form-control mb-2" onChange={handleChange} />
        </div>
        <div className="col-12">
          <textarea name="description" placeholder="Descripción" className="form-control mb-2" onChange={handleChange} required></textarea>
        </div>
      </div>
      <button type="submit" className="btn btn-success">Guardar</button>
      <button type="button" className="btn btn-secondary mi-button" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default NewActionForm;
