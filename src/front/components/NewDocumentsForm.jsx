// components/NewDocumentsForm.jsx
import React, { useState } from "react";

const NewDocumentsForm = ({ apartmentId, onCancel, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    description: "",
    file: null,
    apartment_id: apartmentId,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setError(null);

    if (type === "file") {
      const file = files[0];
      if (file && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Solo se permiten archivos PDF");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("description", formData.description);
      dataToSend.append("apartment_id", formData.apartment_id);
     
      if (formData.file) {
        dataToSend.append("file", formData.file);
        for (let pair of dataToSend.entries()) {
    console.log(pair[0]+ ': ', pair[1]);
  }
      } else {
        setError("Debes subir un archivo PDF.");
        setLoading(false);
        return;
      }

      const res = await fetch(// "https://sample-service-name-bnt3.onrender.com/documents/upload"
        `https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/documents/upload`
        , {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Error desconocido al subir el documento.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al intentar guardar el documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white mt-2">
      <div className="mb-2">
        <input
          name="description"
          placeholder="Descripción"
          className="form-control mb-2"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <input
          name="file"
          type="file"
          accept="application/pdf"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn btn-secondary mi-button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewDocumentsForm;
