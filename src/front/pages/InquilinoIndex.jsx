import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { differenceInDays } from 'date-fns';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { contracts } from "../fecht_contract.js";
import NewFormIssues from "../components/NewIssuesForm.jsx";
import { Invoices } from "../fecht_invoice.js";
import logo from "../assets/img/LogoTrabajoFinal.png";
import html2pdf from "html2pdf.js"
import { apartments } from "../fecht_apartment.js";

const InquilinoIndex = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [id, setId] = useState()

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();



const fetchInquilinoData = async () => {
    setLoading(true);
    setError(null);

    try {
        const data = await contracts.get_asociationbyTenantId(store.todos.id, store.token);
        console.log("Asociaciones recibidas:", data);

        let id = null;

        if (data.length > 0 && data[0].asociaciones.length > 0) {
            id = data[0].asociaciones[0].apartment.id;
            setId(id);
        } else {
            console.warn("No se encontraron asociaciones con apartment id.");
        }

        dispatch({ type: "addAssocByApertmentId", value: data });

        // solo llama si hay id válido
        if (id) {
            try {
                const issuesData = await apartments.getIssuesActionsByApertmentId(id, store.token);
                console.log("issues", issuesData);
                if (!issuesData.error) {
                    dispatch({ type: "add_singleIssues", value: issuesData });
                }
            } catch (error) {
                console.error("Error fetching issues/actions:", error);
            }
        }
    } catch (error) {
        console.error("Error al obtener asociaciones:", error);
    }

    try {
        const invoicesData = await Invoices.tenant_invoices_id(store.todos.id, store.token);
        console.log("add_invoices", invoicesData);
        dispatch({ type: "add_invoices", value: invoicesData.invoices });
    } catch (error) {
        console.error("Error al obtener facturas:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (store.todos.id && store.token) {
            fetchInquilinoData();
        }

    }, [store.user, store.token]);
    console.log(store)
    console.log(id)
    const getstatusBadgeClass = (status) => {
        if (status === "pagada") return 'bg-danger text-white';
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
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!store.AssocByApertmentId?.length) return <div>Bienvenid@, {store.todos.first_name} {store.todos.last_name}. No hemos podido cargar tus datos</div>;
    const startDate = store.AssocByApertmentId[0]?.start_date
        ? new Date(store.AssocByApertmentId[0].start_date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }) : 'Fecha no disponible';
    const endDate = store.AssocByApertmentId[0]?.start_date ? new Date(store.AssocByApertmentId[0].end_date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }) : 'Fecha no Disponible'
    const splitDocument = store.AssocByApertmentId[0].document ? store.AssocByApertmentId[0].document.split("/").pop() : 'Sin documento';

    const today = new Date();
    const contractEndDateObj = new Date(store.AssocByApertmentId[0].end_date);
    const diffDays = differenceInDays(contractEndDateObj, today);

    const getDaysBadgeClass = (days) => {
        if (days < 0) { return 'bg-danger text-white' };
        if (days <= 30) { return 'bg-warning text-dark' };
        if (days <= 90) { return 'bg-info text-white' };
        return 'bg-success text-white';
    };

    const getDaysStatusText = (days) => {
        if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
        if (days === 0) return `Vence hoy`;
        return `Faltan ${days} días`;
    };
    const handleDownloadContract = async (contractId) => {
        console.log(`Intentando descargar contrato con ID: ${contractId}`);
        try {
            const data = await contracts.downloadcontract(contractId, store.token);
            if (data && !data.error) {
                swal("Descarga iniciada", "Tu contrato debería empezar a descargarse.", "success");
            } else {
                swal("Error de descarga", data?.error || "No se pudo descargar el contrato.", "error");
            }
        } catch (error) {
            console.error("Error al descargar contrato:", error);
            swal("Error de conexión", "No se pudo conectar para descargar el contrato.", "error");
        }
    };

    const renderMainContent = () => { };
    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando tu información...</p></div>;
    }
    if (error) {
        return <div className="alert alert-danger text-center p-3">{error}</div>;
    }

    console.log(store.AssocByApertmentId[0].asociaciones[0].apartment.id)
    return (
        <div className="w-100 p-4">
            <h2 className="mb-4" style={{ textTransform: "capitalize" }}>Bienvenid@, {store.todos.first_name} {store.todos.last_name}   </h2>
            <p className="mb-4">Aquí tienes un resumen de tu contrato, vivienda e incidencias.</p>

            <div className="row  g-4">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="card h-100 shadow-lg border-primary">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Mi Contrato</h5>
                        </div>
                        <div className="card-body text-left">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                        <th>Dias Restantes</th>
                                        <th>Renta Mensual</th>
                                        <th>Contrato</th>
                                        <th>Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        <td>{startDate}</td>
                                        <td>{endDate}</td>
                                        <td>{diffDays}</td>
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].renta} €</td>
                                        <td>{splitDocument}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleDownloadContract(store.AssocByApertmentId[0].id)}
                                                >
                                                    Ver Contrato
                                                </button>
                                            </div></td>


                                    </tr>
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-10">
                    <div className="card h-100 shadow-lg border-success">
                        <div className="card-header bg-success text-white text-center">
                            <h5 className="mb-0">Mi Vivienda</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Dirección</th>
                                        <th>CP</th>
                                        <th>Ciudad</th>
                                        <th>Parking</th>

                                        <th>Tipo</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        style={{ cursor: "pointer", textTransform: "capitalize" }}
                                    >
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].apartment.address}</td>
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].apartment.postal_code}</td>
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].apartment.city}</td>
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].apartment.parking_slot}</td>
                                        <td>{store.AssocByApertmentId[0].asociaciones[0].apartment.type}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-10">
                    <div className="card h-100 shadow-lg border-success">
                        <div className="card-header bg-info text-white text-center">
                            <h5 className="mb-0">Mis Facturas</h5>
                        </div>
                        <div className="card-body">
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
                                                    <span className={`badge ${getstatusBadgeClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">

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
                    </div>
                </div>

                <div className="col-lg-12 col-md-10 col-sm-12 mt-4">
                    <div className="card h-100 shadow-lg border-warning">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Mis Incidencias ({store.singleIssues.issues?.length})</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group mt-2">
                                <h2>Incidencias</h2>
                                {
                                    store && store.singleIssues.issues && store.singleIssues.issues.map((item) => {

                                        item.status === "cerrado" ? "bg-danger text-white" : "bg-info text-black";

                                        const startDate = new Date(item.start_date).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        });

                                        return (
                                            <li
                                                key={item.issue_id}
                                                className="list-group-item d-flex flex-column contenedor">
                                                <div className="contratitem">
                                                    <p><strong>Incidencia:</strong> {item.title} <strong>Fecha de apertura:</strong> {startDate}, <strong>Estado:</strong>  <span className={`badge ${item.status === "cerrado" ? "bg-success text-black" : "bg-danger text-white"}`}>
                                                        {item.status}
                                                    </span></p>
                                                    <p><strong>Descripción:</strong> {item.description}</p>
                                                </div>

                                                <h5 className="mt-3">Actuaciones</h5>
                                                <ul className="list-group">
                                                    {item.actions && item.actions.map((action) => {
                                                        const splitBill = action.bill_image ? action.bill_image.split("/").pop() : 'Sin documento';
                                                        return (
                                                            <li key={action.action_id} className="list-group-item">
                                                                <p><strong>Titulo:</strong> {action.action_name}, <strong>Contratista:</strong> {action.contractor}, <strong>Fecha:</strong> {new Date(action.start_date).toLocaleDateString("es-ES")}</p>
                                                                <p><strong>Importe:</strong> {action.bill_amount}€, <strong>Ver Factura</strong> {splitBill}   </p>
                                                                <span className="d-inline-block ms-2"> {/* Añadido contenedor flexible */}
                                                                    <strong>Ver Factura:</strong> {splitBill}
                                                                </span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                               
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            {showForm && (
                                <NewFormIssues
                                    apartmentId={store.AssocByApertmentId[0].asociaciones[0].apartment.id}
                                    tenant_name={store.todos.first_name}
                                    address={store.AssocByApertmentId[0].asociaciones[0].apartment.address}
                                    onSuccess={() => {
                                        setShowForm(false);
                                        //  fetchApartments();
                                        // setShowbotton(true)
                                    }}
                                    onCancel={() => { setShowForm(false) }}
                                />
                            )}
                            <button className="btn btn-outline-dark mt-3" onClick={() => { setShowForm(true) }}>Reportar Nueva Incidencia</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );


 {/*   return (
        <div className="container-fluid mt-3 px-3">
            <div className="row">
                <div
                    className="col-md-3 sidebar-private d-flex flex-column"
                    style={{
                        width: '250px',
                        minHeight: '100vh',
                        backgroundColor: 'rgba(138, 223, 251, 0.8)',
                        padding: '1.5rem 1rem',
                        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                        top: 0,
                        left: 0,
                        zIndex: 1000,
                        overflowY: 'auto',
                        paddingTop: 'calc(1.5rem + 70px)',
                    }}
                >
                    <div className="sidebar-header text-center mb-4">
                        <img
                            src="src/front/assets/img/LogoTrabajoFinal.png"
                            alt="Logo"
                            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                            className="mb-2"
                        />
                        <h5 className="text-white fw-bold mb-0">Panel de Inquilino</h5>
                        <small className="text-white-50">Gestion Inmuebles</small>
                    </div>

                    <ul className="nav flex-column flex-grow-1">
                        {navItems.map((item) => (
                            <li className="nav-item mb-2" key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`nav-link d-flex align-items-center rounded py-2 px-3
                                    ${location.pathname === item.path ? 'active-sidebar-link' : 'text-white'}`}
                                    onClick={(e) => {
                                        if (item.path === location.pathname && item.path !== "/acceso") {
                                            e.preventDefault();
                                        }
                                        if (item.path !== location.pathname) {
                                            navigate(item.path);
                                        }
                                        if (item.name === "Salir") {
                                            localStorage.removeItem("jwt-token");
                                        }
                                    }}
                                    style={{
                                        transition: 'background-color 0.2s, color 0.2s',
                                        fontSize: '1.1rem',
                                        '--bs-link-color-rgb': '255, 255, 255',
                                        '--bs-link-hover-color-rgb': '255, 255, 255',
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="me-3" style={{ width: '20px' }} />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-md-9">
                    <div className="p-2 border rounded bg-light min-vh-100">
                        {renderMainContent()}
                    </div>
                </div>
            </div>
        </div>
    );*/}
};

export default InquilinoIndex;