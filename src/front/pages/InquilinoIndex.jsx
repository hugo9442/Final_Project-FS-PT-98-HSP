import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { differenceInDays } from 'date-fns';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { contracts } from "../fecht_contract.js";
import NewFormIssues from "../components/NewIssuesForm.jsx";

const InquilinoIndex = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();

  

    const fetchInquilinoData = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await contracts.get_asociationbyTenantId(store.todos.id, store.token);
            console.log("Asociaciones recibidas:", data);
            dispatch({ type: "addAssocByApertmentId", value: data });
        } catch (error) {
            console.error("Error al obtener asociaciones:", error);
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


    const renderMainContent = () => {};
        if (loading) {
            return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando tu información...</p></div>;
        }
        if (error) {
            return <div className="alert alert-danger text-center p-3">{error}</div>;
        }


        return (
            <div className="text-center w-100 p-4">
                <h2 className="mb-4">Bienvenid@, {store.todos.first_name} {store.todos.last_name}   </h2>
                <p className="mb-4">Aquí tienes un resumen de tu contrato, vivienda e incidencias.</p>

                <div className="row justify-content-center g-4">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="card h-100 shadow-lg border-primary">
                            <div className="card-header bg-primary text-white text-center">
                                <h5 className="mb-0">Mi Contrato</h5>
                            </div>
                            <div className="card-body text-left">


                                <p className="card-text mb-1">
                                    <strong>Inicio:</strong>{startDate}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Fin:</strong> {endDate}
                                </p>
                                <p className="card-text mb-1">
                                    <strong>Documento:</strong> {splitDocument}
                                </p>
                                <p className="card-text">
                                    <strong>Días restantes:</strong> {diffDays}
                                </p>
                                <p className="card-text">
                                    <strong>Renta Mensual:</strong>
                                </p>


                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card h-100 shadow-lg border-success">
                            <div className="card-header bg-success text-white text-center">
                                <h5 className="mb-0">Mi Vivienda</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text mb-1" style={{textTransform:"capitalize"}}><strong>Dirección:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.address }</p>
                                <p className="card-text mb-1"><strong>C.P.:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.postal_code }</p>
                                <p className="card-text mb-1" style={{textTransform:"capitalize"}}><strong>Ciudad:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.city } </p>
                                <p className="card-text mb-1"><strong>Plaza de Parking:</strong> {store.AssocByApertmentId[0].asociaciones[0].apartment.parking_slot} </p>


                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-10 col-sm-12 mt-4">
                        <div className="card h-100 shadow-lg border-warning">
                            <div className="card-header bg-warning text-dark">
                                <h5 className="mb-0">Mis Incidencias ({store.AssocByApertmentId[0].asociaciones[0].apartment.issues.length})</h5>
                            </div>
                            <div className="card-body">
                                {store.AssocByApertmentId[0].asociaciones[0].apartment.issues.length > 0 ? (
                                    <ul className="list-group list-group-flush text-left">
                                        {misIncidencias.map(inc => {
                                            const issuestartDate = inc.start_date ? format(new Date(inc.start_date), 'dd/MM/yyyy') : 'N/A';
                                            const issueEndDate = inc.end_date ? format(new Date(inc.end_date), 'dd/MM/yyyy') : 'N/A';

                                            return (
                                                <li key={inc.issue_id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-0">
                                                    <div>
                                                        <strong className="text-dark">{inc.title || 'Sin título'}</strong>
                                                        <small className="d-block text-muted">
                                                            Fecha: {issuestartDate} - {issueEndDate}
                                                        </small>
                                                        <span className={`badge ${inc.status === 'Abierta' ? 'bg-danger' : inc.status === 'En Proceso' ? 'bg-warning text-dark' : 'bg-secondary'} ms-2`}>
                                                            {inc.status || 'Desconocido'}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="card-text text-muted text-center">No se encontraron incidencias activas para tu vivienda.</p>
                                )}
                                   {showForm && (
              <NewFormIssues
                onSuccess={() => {
                  setShowForm(false);
                //  fetchApartments();
                 // setShowbotton(true)
                }}
                onCancel={() => {setShowForm(false)}}
              />
            )}
                                <button className="btn btn-outline-dark mt-3" onClick={() => {setShowForm(true)}}>Reportar Nueva Incidencia</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    

    return (
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
    );
};

export default InquilinoIndex;