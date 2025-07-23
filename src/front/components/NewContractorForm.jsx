import React, { useState, useEffect } from "react";
import { contractor } from "../fecht_contractor.js";
import { categories } from "../fecht_categories.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const NewContractorForm = ({ onSuccess, onCancel }) => {
  const { store } = useGlobalReducer();
  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    phone: "",
    email: "",
    name_contact: "",
    notes: ""
  });
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categories.getcategories(store.token);
        if (data.msg === "ok") {
          setCategoriesList(data.categories);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await contractor.create(formData, store.token);
      if (data.msg === "ok" && data.contractor)  {
        onSuccess(data.contractor);
      } else {
        alert("Error al crear contractor");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="card p-3 mt-4">
      <h5>Nuevo Contractor / Proveedor</h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-2"
          name="cif"
          placeholder="CIF / NIF"
          value={formData.cif}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="name_contact"
          placeholder="Nombre del Contacto"
          value={formData.name_contact}
          onChange={handleChange}
        />
         <input
          className="form-control mb-2"
          name="notes"
          placeholder="Anotaciones"
          value={formData.notes}
          onChange={handleChange}
        />
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewContractorForm;
