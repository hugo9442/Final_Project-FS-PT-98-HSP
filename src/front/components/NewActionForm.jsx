

import React, { useState, useEffect } from "react";

import storeReducer from "../store";
import { contractor } from "../fecht_contractor";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { expenses } from "../fecht_expenses.js";
import { categories } from "../fecht_categories.js";
import { Urlexport } from "../urls.js";
import NewContractorForm from "./NewContractorForm";

 
const NewActionForm = ({ issueId, apartmentId, token, onSuccess, onClose }) => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [showContractorForm, setShowContractorForm] = useState(false);

   const fetchData = async () => {
    
      try {
            const data = await contractor.getContractor(store.token);
            
            if (data.msg === "ok") {
              
              dispatch({ type: "add_contractor", value: data.contractor });
            }
          } catch (error) {
            console.error("Error al cargar contractors:", error);
          }

      try {
              const data = await categories.getcategories(store.token);
              
              if (data.msg === "ok") {
                setCategoriesList(data.categories);
              }
            } catch (error) {
              console.error("Error cargando categorías:", error);
            }
     
    };
  
    useEffect(() => {
      fetchData();
    }, [store.token]);

  const [formData, setFormData] = useState({
    action_name: "",
    start_date: "",
    description: "",
    bill_amount: "",
    contractor_id: "",
    category_id:"",
    file: null,
  });

 const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bill_amount") {
      // Reemplaza coma por punto
      const normalizedValue = value.replace(',', '.');

      // Permite solo números y un punto decimal
      if (/^\d*\.?\d*$/.test(normalizedValue)) {
        setFormData((prev) => ({
          ...prev,
          [name]: normalizedValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.bill_amount);
    if (isNaN(amount) || amount <= 0) {
      setError({ bill_amount: "El importe debe ser un número mayor que 0" });
      return;
    }

  setError({});
    try {
      // 1. Crear acción
      const actionPayload = {
        action_name: formData.action_name,
        start_date: formData.start_date,
        description: formData.description,
        contractor_id: formData.contractor_id,
        issue_id: issueId,
      };

      const res = await fetch(`${Urlexport}/actions/create`
    
    , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(actionPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error creando acción:", data);
        return;
      }

      const actionId = data.id;
      const contractor = store.contractor?.find(c => c.id == formData.contractor_id);
      const contractorName = contractor?.name || "";

      let documentId = null;
      
      // 2. Crear documento si hay archivo
      if (formData.file) {
       

        
        const docForm = new FormData();
        docForm.append("description", `Factura de ${contractorName} de la incidencia nº${issueId} y la accion nº${actionId}`);
        docForm.append("apartment_id", apartmentId);
        docForm.append("contractor_id", formData.contractor_id);
        docForm.append("action_id", actionId);
        docForm.append("file", formData.file);
        
       
        const docRes = await fetch( `${Urlexport}/documents/upload`
      
       , {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: docForm,
        });

        const docData = await docRes.json();
        if (!docRes.ok) {
          console.error("Error creando documento:", docData);
        }else {
          documentId = docData.document?.id;
        }
      }

      
       if (formData.bill_amount && documentId) {

         const actionPayloadExpense = {
        description: formData.description,
        date: formData.start_date,
        received_invoices: formData.bill_amount,
        apartment_id: apartmentId,
        contractor_id: formData.contractor_id,
        category_id: formData.category_id,
        action_id: actionId,
        document_id: documentId
      };
       console.log(actionPayloadExpense)
      
        const expenseRes = await fetch(`${Urlexport}/expenses/create`
          
          ,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(actionPayloadExpense),
          }
        );

        const expenseData = await expenseRes.json();
        if (!expenseRes.ok) {
          console.error("Error creando gasto:", expenseData);
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error general:", err);
    }
  };


return(
  <>
  <form onSubmit={handleSubmit} className="p-3 border rounded bg-white mt-2">
  <div className="row g-3"> 
    <div className="col-md-6">
      <input name="action_name" placeholder="Nombre de actuación" className="form-control mb-3" onChange={handleChange} required />

   <select
  className="form-select mb-3"
  value={formData.contractor_id}
  name="contractor_id"
  onChange={(e) => {
    if (e.target.value === "__new__") {
      setShowContractorForm(true);
      return;
    }
    handleChange(e);
  }}
  required
>
  <option value="">Seleccione un contratista</option>
  {store.contractor?.map(cont => (
    <option key={cont.id} value={cont.id}>{cont.name}</option>
  ))}
  <option value="__new__">+ Crear nuevo contratista</option>
</select>

      <input name="start_date" type="date" className="form-control mb-3" onChange={handleChange} required />
    </div>

    <div className="col-md-6">
      <input
        name="bill_amount"
        placeholder="Importe de factura"
        type="text"
        className="form-control mb-3"
        value={formData.bill_amount}
        onChange={handleChange}
      />
     
         <select
        className="form-select mb-3"
        value={formData.category_id}
        name="category_id"
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una categoria de gasto</option>
        {categoriesList.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    
      <input name="file" type="file" accept="application/pdf" className="form-control mb-3" onChange={(e) => {
    setFormData({
      ...formData,
      file: e.target.files[0], // Asegúrate de que sea [0]
    });
  }} />
    </div>

    <div className="col-12">
      <textarea name="description" placeholder="Descripción" className="form-control mb-3" onChange={handleChange} required />
    </div>

    <div className="col-12 d-grid gap-2 d-md-flex justify-content-md-start">
      <button type="submit" className="btn btn-success">Guardar</button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
    </div>
  </div>
</form>



{showContractorForm && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Nuevo contratista</h5>
          <button type="button" className="btn-close" onClick={() => setShowContractorForm(false)}></button>
        </div>
        <div className="modal-body">
          <NewContractorForm
            onSuccess={(newContractor) => {
              fetchData(); // actualiza la lista de contractors
              setFormData(prev => ({
                ...prev,
                contractor_id: newContractor.id // selecciona automáticamente
              }));
              setShowContractorForm(false);
            }}
            onCancel={() => setShowContractorForm(false)}
          />
        </div>
      </div>
    </div>
  </div>
)}

</>
)
 }

 export default NewActionForm;