import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { expenses } from "../fecht_expenses";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NewPaymentForm from "../components/NewPaymentForm";
import NewExpenseFromContractor from "../components/NewExpenseFromContractor"; // 👉 nuevo import
import * as XLSX from "xlsx";
import { useReactToPrint } from 'react-to-print';
import { contractor } from "../fecht_contractor";

const ContractorDetail = () => {
    const { contractorId } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false); // 👉 nuevo estado
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Gastos del contractor #${contractorId}`,
    });

    const fetchContractorExpenses = async () => {
        try {
            const data = await expenses.get_expenses_by_contractor(parseInt(contractorId), store.token);
            if (!data.error) {
                dispatch({ type: "add_contractor_expenses", value: data.expenses });
            }
        } catch (err) {
            setError("Error cargando datos del contractor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractorExpenses();
    }, [contractorId]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const openExpenseModal = () => setShowExpenseModal(true); // 👉 nuevo
    const closeExpenseModal = () => setShowExpenseModal(false); // 👉 nuevo

    const exportTableToExcel = () => {
        const table = document.getElementById("expenses-table");
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Gastos" });
        XLSX.writeFile(workbook, "gastos.xlsx");
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    const name = () => {
        const contractor = store.contractor.find(e => e.id === parseInt(contractorId));
        return contractor ? contractor.name : "";
    };
    const nombre=name()
    console.log("nombre",nombre)
    let acumulado = 0;
    console.log(store.contractor)
    return (
        <div className="container mt-4">
            <h2>Detalle del Proveedor {nombre}</h2>

            <div className="d-flex gap-2 flex-wrap mb-3">
                <button className="btn btn-outline-primary" onClick={exportTableToExcel}>
                    Exportar gastos a Excel
                </button>
                <button className="btn btn-outline-primary" onClick={handlePrint}>
                    Imprimir tabla
                </button>
                <button className="btn btn-outline-primary" onClick={openModal}>
                    Registrar nuevo pago
                </button>
                <button className="btn btn-outline-success" onClick={openExpenseModal}> {/* 👉 nuevo */}
                    Añadir gasto
                </button>
            </div>

            {/* Contenido a imprimir */}
            <div ref={componentRef}>
                <table id="expenses-table" className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Pagos</th>
                            <th>Fra. recibida</th>
                            <th>Pendiente</th>
                            <th>Balance</th>

                        </tr>
                    </thead>
                    <tbody>
                        {store.contractorexpenses?.sort((b, a) => new Date(b.date) - new Date(a.date))
                            .map((item) => {
                                acumulado += item.balance;
                                return (
                                    <tr key={item.id}>
                                        <td>{new Date(item.date).toLocaleDateString("es-ES")}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            {item.payments?.length > 0 ? (
                                                <ul>
                                                    {item.payments
                                                        .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date))
                                                        .map((p) => (
                                                            <li key={p.id}>{p.payment_date}: {p.amount} €</li>
                                                        ))}
                                                </ul>
                                            ) : (
                                                "Sin pagos"
                                            )}
                                        </td>
                                        <td>{item.received_invoices} €</td>
                                        <td style={{ color: item.balance > 0 ? "black" : "red" }}>
                                            {item.balance.toFixed(2)}
                                        </td>
                                        <td style={{ color: acumulado > 0 ? "black" : "red" }}>
                                            {acumulado.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* MODAL PAGO */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar nuevo pago</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <NewPaymentForm
                                    contractorId={contractorId}
                                    token={store.token}
                                    expenses={store.contractorexpenses}
                                    onSuccess={() => {
                                        closeModal();
                                        fetchContractorExpenses();
                                    }}
                                    onClose={closeModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL NUEVO GASTO */}
            {showExpenseModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Añadir nueva factura</h5>
                                <button type="button" className="btn-close" onClick={closeExpenseModal}></button>
                            </div>
                            <div className="modal-body">
                                <NewExpenseFromContractor
                                    contractorId={contractorId}
                                    token={store.token}
                                    onSuccess={() => {
                                        closeExpenseModal();
                                        fetchContractorExpenses();
                                    }}
                                    onClose={closeExpenseModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractorDetail;
