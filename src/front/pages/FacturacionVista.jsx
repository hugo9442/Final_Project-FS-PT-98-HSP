{/*import React from "react";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { Invoices } from "../fecht_invoice.js";
import html2pdf from "html2pdf.js"
import logo from "../assets/img/LogoTrabajoFinal.png";
import swal from "sweetalert"; // opcional si quieres alertas bonitas

const Facturacionvista = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await Invoices.tenant_invoices(store.token);
            await dispatch({ type: "add_invoices", value: data.invoices });
        } catch (error) {
            console.error("Error al cargar facturas:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [store.todos, store.token]);

    const getDaysBadgeClass = (status) => {
        if (status === "pendiente") return 'bg-danger text-white';
        if (status === "cobrada") return 'bg-success text-white';
        return 'bg-secondary text-white';
    };

    const downloadInvoicePDF = (item) => {
        const content = `
        <div style="font-family: Arial; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src=${logo} alt="Logo" style="width: 100px; height: auto;" />
                <h1 style="display: inline-block; margin-left: 20px; font-size: 24px;">
                    Montoria Gestión de Inmuebles
                </h1>
            </div>
            <h2>Factura #${item.id}</h2>
            <p><strong>Cliente:</strong> ${item.tenant.first_name} ${item.tenant.last_name}</p>
            <p><strong>NIF:</strong> ${item.tenant.national_id}</p>
            <p><strong>Descripción:</strong> ${item.description}</p>
            <p><strong>Importe:</strong> €${item.bill_amount}</p>
            <p><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${item.status}</p>
        </div>`;
        const opt = {
            margin: 0.5,
            filename: `Factura_${item.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(content).set(opt).save();
    };

    // 🚀 NUEVA FUNCION PARA MODIFICAR STATUS
    const updateInvoiceStatus = async (invoiceId) => {
        try {
            const data = await Invoices.modify_invoice(invoiceId, store.token);
            if (data && data.msg) {
                await dispatch({ type: "add_invoices", value: data.invoices });
                fetchData();  // actualiza lista
                swal("Factura actualizada", data.msg, "success");
            } else {
                swal("Error", data.error || "No se pudo actualizar la factura", "error");
            }
        } catch (error) {
            console.error("Error al actualizar factura:", error);
            swal("Error", "No se pudo conectar al servidor", "error");
        }
    };

    return (
        <>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-4 border rounded bg-light">
                            <h2 className="mb-3">Facturas de Clientes</h2>
                            <div className="contract-list-section">
                                {loading ? (
                                    <div className="text-center p-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-3">Cargando facturas...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger text-center p-3">{error}</div>
                                ) : store.invoices && store.invoices.length > 0 ? (
                                    <div className="row row-cols-1 row-cols-md-3 g-3">
                                        {store.invoices.map((item) => {
                                           
                                            const startDate = new Date(item.date).toLocaleDateString("es-ES", {
                                                day: "2-digit", month: "long", year: "numeric"
                                            });
                                            return (
                                                <div className="col mi_alquiler" key={item.id}>
                                                    <div className="card h-100 shadow-sm border">
                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title mb-0">Factura nº {item.id}</h5>
                                                            <p className="card-text mb-1"><strong>{item.tenant.first_name} {item.tenant.last_name}</strong></p>
                                                            <p className="card-text mb-1"><strong>Fecha:</strong> {startDate}</p>
                                                            <p className="card-text mb-1"><strong>Descripción:</strong> {item.description}</p>
                                                            <p className="card-text mb-3"><strong>Importe:</strong> €{item.bill_amount}</p>
                                                            <p className="card-text mb-3"><strong>Estado:</strong> <span className={`badge ${getDaysBadgeClass(item.status)}`}>{item.status}</span></p>
                                                            <div className="mt-auto d-flex justify-content-between">
                                                                <button className="btn btn-success mt-2" style={{ display: item.status === "pendiente" ? "block" : "none" }}   onClick={() => updateInvoiceStatus(item.id)}>
                                                                    Marcar como cobrada
                                                                </button>
                                                                <button className="btn btn-primary" onClick={() => downloadInvoicePDF(item)}>
                                                                    Descargar Factura
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No hay facturas registradas.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Facturacionvista;*/}

import React from "react";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { Invoices } from "../fecht_invoice.js";
import html2pdf from "html2pdf.js"
import logo from "../assets/img/LogoTrabajoFinal.png";
import swal from "sweetalert";

const Facturacionvista = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await Invoices.tenant_invoices(store.token);
            await dispatch({ type: "add_invoices", value: data.invoices });
        } catch (error) {
            console.error("Error al cargar facturas:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [store.todos, store.token]);

    const getDaysBadgeClass = (status) => {
        if (status === "pendiente") return 'bg-danger text-white';
        if (status === "cobrada") return 'bg-success text-white';
        return 'bg-secondary text-white';
    };

    const downloadInvoicePDF = (item) => {
        const content = `
        <div style="font-family: Arial; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src=${logo} alt="Logo" style="width: 100px; height: auto;" />
                <h1 style="display: inline-block; margin-left: 20px; font-size: 24px;">
                    Montoria Gestión de Inmuebles
                </h1>
            </div>
            <h2>Factura #${item.id}</h2>
            <p><strong>Cliente:</strong> ${item.tenant.first_name} ${item.tenant.last_name}</p>
            <p><strong>NIF:</strong> ${item.tenant.national_id}</p>
            <p><strong>Descripción:</strong> ${item.description}</p>
            <p><strong>Importe:</strong> €${item.bill_amount}</p>
            <p><strong>Fecha:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${item.status}</p>
        </div>`;
        const opt = {
            margin: 0.5,
            filename: `Factura_${item.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(content).set(opt).save();
    };

    const updateInvoiceStatus = async (invoiceId) => {
        try {
            const data = await Invoices.modify_invoice(invoiceId, store.token);
            if (data && data.msg) {
                await dispatch({ type: "add_invoices", value: data.invoices });
                fetchData();
                swal("Factura actualizada", data.msg, "success");
            } else {
                swal("Error", data.error || "No se pudo actualizar la factura", "error");
            }
        } catch (error) {
            console.error("Error al actualizar factura:", error);
            swal("Error", "No se pudo conectar al servidor", "error");
        }
    };

    return (
        <>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-4 border rounded bg-light">
                            <h2 className="mb-3">Facturas de Clientes</h2>
                            <div className="contract-list-section">
                                {loading ? (
                                    <div className="text-center p-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-3">Cargando facturas...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger text-center p-3">{error}</div>
                                ) : store.invoices && store.invoices.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Factura</th>
                                                    <th>Cliente</th>
                                                    <th>Fecha</th>
                                                    <th>Descripción</th>
                                                    <th>Importe</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {store.invoices.map((item) => {
                                                    const startDate = new Date(item.date).toLocaleDateString("es-ES", {
                                                        day: "2-digit", month: "long", year: "numeric"
                                                    });
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>#{item.id}</td>
                                                            <td>{item.tenant.first_name} {item.tenant.last_name}</td>
                                                            <td>{startDate}</td>
                                                            <td>{item.description}</td>
                                                            <td>€{item.bill_amount}</td>
                                                            <td>
                                                                <span className={`badge ${getDaysBadgeClass(item.status)}`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button 
                                                                        className="btn btn-success btn-sm" 
                                                                        style={{ display: item.status === "pendiente" ? "block" : "none" }}
                                                                        onClick={() => updateInvoiceStatus(item.id)}
                                                                    >
                                                                        Cobrar
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-primary btn-sm" 
                                                                        onClick={() => downloadInvoicePDF(item)}
                                                                    >
                                                                        PDF
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No hay facturas registradas.</div>
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