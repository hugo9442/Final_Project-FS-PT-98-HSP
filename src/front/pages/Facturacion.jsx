
import React from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { Invoices } from "../fecht_invoice.js";
import swal from "sweetalert";

const Facturacion = () => {
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingrent, setLoadingRent] = useState(true);
    const [data, setData] = useState()

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await Asociations.get_full_asociates(store.token);
            await dispatch({ type: "add_asociation", value: data });
        } catch (error) {
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [store.todos, store.token]);

    const handlemapassoc = () => {
        store.asociation.map((item) => {
            const estado = item.is_active ? "activo" : "inactivo"
            const meses = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            const hoy = new Date();
            const nombreMes = meses[hoy.getMonth()];
            if (estado === "activo" && item.apartment !== null) {
                const data = {
                    owner: `${item.apartment.owner.first_name} ${item.apartment.owner.last_name}`,
                    description: `Renta del mes de ${nombreMes} de ${item.apartment.type}, de la dirección ${item.apartment.address}`,
                    association_id: item.id,
                    owner_id: item.apartment.owner.id,
                    tenant: `${item.tenant.first_name} ${item.tenant.last_name}`,
                    tenant_id: item.tenant_id,
                    bill_amount: item.renta,
                    status: "pendiente"
                }
                setData(data)
            }
        })
    }

    const handleInvoiceCreate = async (data) => {
        try {
            const response = await Invoices.create_invoice(data, store.token);
            if (response.error) {
                swal({
                    title: "Error",
                    text: response.error,
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                });
            } else if (response.msg !== "ok") {
                swal({
                    title: "Éxito",
                    text: response.msg,
                    icon: "success",
                });
            } else {
                swal({
                    title: "Atención",
                    text: "No se recibió respuesta esperada del servidor.",
                    icon: "warning",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createMonthlyInvoices = () => {
        const meses = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        const hoy = new Date();
        const nombreMes = meses[hoy.getMonth()];
        store.asociation.forEach(item => {
            const estado = item.is_active ? "activo" : "inactivo"
            const dateinvoice = meses[item.invoices.date?.getMonth()]

            if (estado === "activo" && item.apartment !== null && dateinvoice !== nombreMes) {
                const data = {
                    status: "pendiente",
                    description: `Renta del mes de ${nombreMes} de ${item.apartment.type}, de la dirección ${item.apartment.address}`,
                    association_id: item.id,
                    owner_id: item.apartment.owner.id,
                    tenant_id: item.tenant.id,
                    bill_amount: item.renta
                }
                handleInvoiceCreate(data);
            }
        })
    }

    return (
        <>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-4 border rounded bg-light">
                            <h2 className="mb-3">Facturar Alquileres Activos</h2>
                            <div className="contract-list-section">
                                {loading ? (
                                    <div className="text-center p-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <p className="mt-3">Cargando contratos...</p>
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-danger text-center p-3">{error}</div>
                                ) : store.asociation && store.asociation.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Inquilino</th>
                                                    <th>Dirección</th>
                                                    <th>Código Postal</th>
                                                    <th>Ciudad</th>
                                                    <th>Importe a Facturar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {store.asociation.map((item) => {
                                                    const estado = item.is_active ? "activo" : "inactivo";
                                                    if (estado === "activo" && item.apartment !== null) {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <strong>{item.tenant.first_name} {item.tenant.last_name}</strong>
                                                                </td>
                                                                <td>{item.apartment?.address}</td>
                                                                <td>{item.apartment?.postal_code}</td>
                                                                <td>{item.apartment?.city}</td>
                                                                <td>{item.renta}€</td>
                                                            </tr>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No hay contratos registrados para este usuario.</div>
                                )}
                            </div>
                            <button 
                                className="btn btn-success mi-button mt-2" 
                                style={{
                                    color: "black",
                                    backgroundColor: 'rgba(138, 223, 251, 0.8)',
                                    textDecoration: "strong",
                                }}
                                onClick={createMonthlyInvoices}
                            >
                                <strong>Facturar todos los alquileres</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Facturacion;