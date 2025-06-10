import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js"; 
import { contracts } from "../fecht_contract.js";   
import { Issues } from "../fecht_issues.js"; 

const InquilinoIndex = () => { 
    const [miViviendaInfo, setMiViviendaInfo] = useState(null);
    const [miContratoInfo, setMiContratoInfo] = useState(null);
    const [misIncidencias, setMisIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);     

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { "name": "Inicio", "path": "/inquilinoindex", "icon": "gauge-high" }, 
        { "name": "Mi Vivienda", "path": "/inquilinoindex", "icon": "house-chimney" },
        { "name": "Mi Contrato", "path": "/inquilinoindex", "icon": "file-signature" },
        { "name": "Mis Incidencias", "path": "/inquilinoindex", "icon": "triangle-exclamation" },
        { "name": "Perfil", "path": "/inquilinoindex", "icon": "user" },
        { "name": "Salir", "path": "/acceso", "icon": "right-from-bracket" }
    ];

    useEffect(() => {
        const fetchInquilinoData = async () => {
            setLoading(true);
            setError(null);

            if (!store.user || !store.token) {
                console.log("Usuario o token no disponibles, no se cargan datos del inquilino.");
                setLoading(false);
                return;
            }

            try {
                const viviendaRes = await apartments.getApartmentByTenantId(store.token);
                if (viviendaRes && !viviendaRes.error && viviendaRes.apartment) {
                    setMiViviendaInfo(viviendaRes.apartment);

                    if (viviendaRes.apartment.id) {
                        const incidenciasRes = await Issues.getissuesByApartmentId(viviendaRes.apartment.id, store.token);
                        if (incidenciasRes && !incidenciasRes.error && incidenciasRes.Issues) {
                            setMisIncidencias(incidenciasRes.Issues);
                        } else {
                            setMisIncidencias([]);
                        }
                    } else {
                        setMisIncidencias([]);
                    }
                } else {
                    setMiViviendaInfo(null);
                    setMisIncidencias([]);
                }

                const contratoRes = await contracts.getContractByTenantId(store.token);
                if (contratoRes && !contratoRes.error && contratoRes.contract) {
                    setMiContratoInfo(contratoRes.contract);
                } else {
                    setMiContratoInfo(null);
                }

            } catch (err) {
                console.error("Error general al cargar datos del inquilino:", err);
                setError("Hubo un problema al cargar tu información. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchInquilinoData();
    }, [store.user, store.token, navigate]);

    const renderMainContent = () => {
        if (loading) {
            return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div><p className="mt-3">Cargando tu información...</p></div>;
        }
        if (error) {
            return <div className="alert alert-danger text-center p-3">{error}</div>;
        }
        const getContractDetails = (contract) => {
            if (!contract || !contract.contract_start_date || !contract.contract_end_date) {
                return {
                    startDateFormatted: 'N/A',
                    endDateFormatted: 'N/A',
                    documentName: 'N/A',
                    daysRemaining: 'N/A'
                };
            }

            const startDate = new Date(contract.contract_start_date);
            const endDate = new Date(contract.contract_end_date);
            const today = new Date();

            const startDateFormatted = format(startDate, 'dd MMMM yyyy', { locale: es });
            const endDateFormatted = format(endDate, 'dd MMMM yyyy', { locale: es });
            
            const daysRemaining = differenceInDays(endDate, today);

            const documentName = contract.document ? contract.document.split('/').pop() : 'Sin documento';

            return {
                startDateFormatted,
                endDateFormatted,
                documentName,
                daysRemaining
            };
        };

        const contractDetails = miContratoInfo ? getContractDetails(miContratoInfo) : null;


        return (
            <div className="text-center w-100 p-4">
                <h2 className="mb-4">Bienvenido, inquilino</h2>
                <p className="mb-4">Aquí tienes un resumen de tu contrato, vivienda e incidencias.</p>

                <div className="row justify-content-center g-4"> 
                    <div className="col-lg-10 col-md-10 col-sm-12">
                        <div className="card h-100 shadow-lg border-primary">
                            <div className="card-header bg-primary text-white text-center">
                                <h5 className="mb-0">Mi Contrato</h5>
                            </div>
                            <div className="card-body text-left">
                                {contractDetails ? (
                                    <>
                                        <p className="card-text mb-1">
                                            <strong>Inicio:</strong> {contractDetails.startDateFormatted}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Fin:</strong> {contractDetails.endDateFormatted}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Documento:</strong> {contractDetails.documentName}
                                        </p>
                                        <p className="card-text">
                                            <strong>Días restantes:</strong> {contractDetails.daysRemaining}
                                        </p>
                                        <p className="card-text">
                                            <strong>Renta Mensual:</strong> {miContratoInfo?.monthly_rent ? `${miContratoInfo.monthly_rent}€` : 'N/A'}
                                        </p>
                                    </>
                                ) : (
                                    <p className="card-text text-muted text-center">No tienes un contrato asignado o no se pudo cargar la información.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card h-100 shadow-lg border-success">
                            <div className="card-header bg-success text-white text-center">
                                <h5 className="mb-0">Mi Vivienda</h5>
                            </div>
                            <div className="card-body">
                                {miViviendaInfo ? (
                                    <>
                                        <p className="card-text mb-1"><strong>Dirección:</strong> {miViviendaInfo.address || 'N/A'}</p>
                                        <p className="card-text mb-1"><strong>Ciudad:</strong> {miViviendaInfo.city || 'N/A'}</p>
                                        <p className="card-text"><strong>C.P.:</strong> {miViviendaInfo.postal_code || 'N/A'}</p>
                                    </>
                                ) : (
                                    <p className="card-text text-muted">No tienes una vivienda asignada o no se pudo cargar la información.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-10 col-sm-12 mt-4">
                        <div className="card h-100 shadow-lg border-warning">
                            <div className="card-header bg-warning text-dark text-center">
                                <h5 className="mb-0">Mis Incidencias ({misIncidencias.length})</h5>
                            </div>
                            <div className="card-body">
                                {misIncidencias.length > 0 ? (
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
                                <button className="btn btn-outline-dark mt-3">Reportar Nueva Incidencia</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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