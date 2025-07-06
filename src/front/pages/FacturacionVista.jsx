import React from "react";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { Invoices } from "../invoice.js";
import html2pdf from "html2pdf.js"
import logo from "../assets/img/LogoTrabajoFinal.png";

const Facturacionvista = () => {

    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingrent, setLoadingRent] = useState(true);
    const [associtem, setAssocitem] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {

            const data = await Invoices.tenant_invoices(store.token);

            await dispatch({ type: "add_invoices", value: data.invoices });

        } catch (error) {
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [store.todos, store.token]);
const downloadInvoicePDF = (item) => {
  // Creamos un HTML dinámico con la factura
  const content = `
    <div style="font-family: Arial; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
  <img src=${logo} alt="Logo" style="width: 100px; height: auto; vertical-align: middle; display: inline-block;" />
  <h1 style="display: inline-block; margin-left: 20px; vertical-align: middle; font-size: 24px;">
    Montoria Gestión de Inmuebles
  </h1>
</div>
    </div>
      <h2>Factura #${item.id}</h2>
      <p><strong>Cliente:</strong> ${item.tenant.first_name} ${item.tenant.last_name}</p>
      <p><strong>NIF:</strong> ${item.tenant.national_id}</p>
      <p><strong>Descripción:</strong> ${item.description}</p>
      <p><strong>Importe:</strong> €${item.bill_amount}</p>
      <p><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> ${item.status}</p>
    </div>
  `;

  // Configuramos html2pdf
  const opt = {
    margin:       0.5,
    filename:     `Factura_${item.id}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(content).set(opt).save();
};


    console.log(store)

    return (
        <>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-4 border rounded bg-light">
                            <h2 className="mb-3">Facturas de Clientes</h2>
                            <div className="contract-list-section">
                                {loading ? (
                                    <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando contratos...</p></div>
                                ) : error ? (
                                    <div className="alert alert-danger text-center p-3">{error}</div>
                                ) : store.invoices && store.invoices.length > 0 ? (
                                    <div className="row row-cols-1 row-cols-md-3  row-cols-lg-3 g-3">
                                        {store.invoices.map((item) => {

                                            const startDate = new Date(item.date).toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            });

                                            return (
                                                <div className="col mi_alquiler" key={item.id}>
                                                    <div className="card h-100 shadow-sm border">
                                                        <div className="card-body d-flex flex-column">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <h5 className="card-title mb-0">Factura nº {item.id}</h5>

                                                            </div>

                                                            <p className="card-text mb-1">
                                                                <strong>{item.tenant.first_name} {item.tenant.last_name}, </strong>
                                                                de fecha  <strong>{startDate}</strong>
                                                            </p>
                                                            <p className="card-text mb-1">
                                                                <strong>Descrpción:</strong> {item.description}, 
                                                            </p>
                                                            <p className="card-text mb-3">
                                                             <strong>Importe:</strong> {item.bill_amount}
                                                            </p>
                                                            <p className="card-text mb-3">
                                                             <strong>Estado:</strong> {item.status}
                                                            </p>
                                                            <div className="mt-auto d-flex justify-content-between">
                                                              
                                                                <button
                                                                    className=" btn btn-success mt-2"
                                                                    onClick={() => handleDeleteRent(item.contract.id, item.apartment.id)}
                                                                >
                                                                   Marcar como cobrada
                                                                </button>
                                                                <button className="btn btn-success" onClick={() => downloadInvoicePDF(item)}>
        Descargar PDF
      </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );          

                                            


                                        

                                        })}
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No hay contratos registrados para este usuario.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

};

export default Facturacionvista;