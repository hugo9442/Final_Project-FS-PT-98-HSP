import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { expenses } from "../fecht_expenses";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NewPaymentForm from "../components/NewPaymentForm";

const ContractorDetail = () => {
    const { contractorId } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const closeModal = () => {
        setShowModal(false);
    };


    

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Detalle del Contractor #{contractorId}</h2> <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={openModal}>
                    Registrar nuevo pago
                </button>
            </div>


            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Pagos</th>
                        <th>Fra. recibida</th>
                        <th>balance</th>
                    </tr>
                </thead>
                <tbody>
                    {store.contractorexpenses?.map((item) => (
                        <tr key={item.id}>
                            <td>{new Date(item.date).toLocaleDateString("es-ES")}</td>
                            <td>{item.description}</td>
                            <td>
                                {item.payments?.length > 0 ? (
                                    <ul>
                                        {item.payments.map((p) => (
                                            <li key={p.id}>{p.payment_date}: {p.amount} €</li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Sin pagos"
                                )}
                            </td>
                            <td>{item.received_invoices} €</td>
                            <td>
                               {item.balance}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL */}
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
                                        fetchContractorExpenses(); // refresca tras insertar
                                    }}
                                    onClose={closeModal}
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
