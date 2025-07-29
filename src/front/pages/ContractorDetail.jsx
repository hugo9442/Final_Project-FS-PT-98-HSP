import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { expenses } from "../fecht_expenses";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NewPaymentForm from "../components/NewPaymentForm";
import NewExpenseFromContractor from "../components/NewExpenseFromContractor"; 
import * as XLSX from "xlsx";
import ReactToprint from "react-to-print";
import { useReactToPrint } from 'react-to-print';

const ContractorDetail = () => {

   const { contractorId } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expenseid, setExpenseid] = useState();
    const [showExpenseModal, setShowExpenseModal] = useState(false); // 👉 nuevo estado
    const componentRef = useRef();



    const fetchContractorExpenses = async () => {
        try {
            const data = await expenses.get_expenses_by_contractor(parseInt(contractorId), store.token);
            if (!data.error) {
                dispatch({ type: "add_contractor_expenses", value: data.expenses });
            }
        } catch (err) {
            setError("Error cargando datos del contractor.");
        } finally {
          //  setLoading(false);
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

    const handlePrint = useReactToPrint({
    contentRef: componentRef, // ✅ versión 3 requiere esto
    documentTitle: `Gastos del contractor #${contractorId}`,
    onBeforeGetContent: () => {
      console.log("Preparando para imprimir...");
    },
    onAfterPrint: () => {
      console.log("Impresión finalizada");
    },
    onPrintError: (err) => {
      console.error("Error en impresión:", err);
    },
  });



  //  if (loading) return <div>Cargando...</div>;
  //  if (error) return <div>{error}</div>;
    const name = () => {
        const contractor = store.contractor.find(e => e.id === parseInt(contractorId));
        return contractor ? contractor.name : "";
    };


    let acumulado = 0;
    console.log(store)
    console.log("componentRef:", componentRef);
console.log("componentRef.current:", componentRef.current);
    return (
   
        <div className="container mt-4">
       

        <h2>Detalle del Proveedor {name()}</h2>

        <div className="d-flex gap-2 flex-wrap mb-3 ">
            <button className="btn btn-outline-primary" onClick={exportTableToExcel}>
                Exportar gastos a Excel
            </button>
            <button className="btn btn-outline-primary" onClick={handlePrint}>Imprimir tabla</button>
            <button className="btn btn-outline-primary" onClick={openModal}>
                Registrar nuevo pago
            </button>
            <button className="btn btn-outline-success" onClick={openExpenseModal}>
                Añadir gasto
            </button>
        </div>

    
        <div ref={componentRef} >
            <div className="table-responsive">
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
                    <tbody style={{ cursor: "pointer", textTransform: "capitalize" }}>
                        {store.contractorexpenses?.sort((b, a) => new Date(b.date) - new Date(a.date))
                            .map((item) => {
                                acumulado += item.balance;
                                return (
                                    <tr key={item.id} onClick={() => { item.balance < 0 && openModal(); setExpenseid(item.id); }}>
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
        </div>
      
            
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
                                    id={expenseid}
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
