import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js";
import { contracts } from "../fecht_contract.js"; 
import { incidents } from "../fecht_incidents.js";

const InquilinoIndex = () => {
    const [activeOption, setActiveOption] = useState(null);
    const [miViviendaInfo, setMiViviendaInfo] = useState(null);
    const [miContratoInfo, setMiContratoInfo] = useState(null);
    const [totalMisIncidencias, setTotalMisIncidencias] = useState(0);

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { "name": "Inicio", "path": "/inquilinoindex", "icon": "gauge-high", "internalOption": null },
        { "name": "Mi Vivienda", "path": "/inquilinoindex", "icon": "house-chimney", "internalOption": "mi_vivienda" },
        { "name": "Mi Contrato", "path": "/inquilinoindex", "icon": "file-signature", "internalOption": "mi_contrato" },
        { "name": "Mis Incidencias", "path": "/inquilinoindex", "icon": "triangle-exclamation", "internalOption": "mis_incidencias" },
        { "name": "Perfil", "path": "/inquilinoindex", "icon": "user", "internalOption": "perfil" },
        { "name": "Salir", "path": "/acceso", "icon": "right-from-bracket", "internalOption": "salir" }
    ];

    useEffect(() => {
        const fetchInquilinoData = async () => {
            if (store.user && store.user.id && store.token) {
                try {
                    const viviendaData = await apartments.getApartmentByTenantId(store.user.id, store.token);
                    if (viviendaData && !viviendaData.error) {
                        setMiViviendaInfo(viviendaData);
                    } else {
                        console.warn("No se pudo obtener la vivienda del inquilino o no tiene una:", viviendaData.error);
                        setMiViviendaInfo(null);
                    }

                    const contratoData = await contracts.getContractByTenantId(store.user.id, store.token);
                    if (contratoData && !contratoData.error) {
                        setMiContratoInfo(contratoData);
                    } else {
                        console.warn("No se pudo obtener el contrato del inquilino o no tiene uno:", contratoData.error);
                        setMiContratoInfo(null);
                    }

                    const incidenciasCount = await incidents.getIncidentsByTenantId(store.user.id, store.token);
                    if (incidenciasCount && incidenciasCount.total !== undefined) {
                        setTotalMisIncidencias(incidenciasCount.total);
                    } else {
                        console.warn("No se pudo obtener el recuento de incidencias:", incidenciasCount.error);
                        setTotalMisIncidencias(0);
                    }

                } catch (error) {
                    console.error("Error general al cargar datos del inquilino:", error);
                }
            } else {
                console.log("Usuario o token no disponibles, no se cargan datos del inquilino.");
                navigate("/Acceso"); 
            }
        };

        fetchInquilinoData();
    }, [store.user, store.token, navigate]);

    const renderContent = () => {
        switch (activeOption) {
            case "mi_vivienda":
                return (
                    <div>
                        <h3>Detalles de Mi Vivienda</h3>
                        {miViviendaInfo ? (
                            <div>
                                <p><strong>Dirección:</strong> {miViviendaInfo.address}</p>
                                <p><strong>Ciudad:</strong> {miViviendaInfo.city}</p>
                                <p>Aquí se mostrará la información detallada de la vivienda que tienes asignada.</p>
                            </div>
                        ) : (
                            <p>No tienes una vivienda asignada o hubo un problema al cargarla.</p>
                        )}
                    </div>
                );
            case "mi_contrato":
                return (
                    <div>
                        <h3>Detalles de Mi Contrato</h3>
                        {miContratoInfo ? (
                            <div>
                                <p><strong>Fecha Inicio:</strong> {miContratoInfo.contract_start_date}</p>
                                <p><strong>Fecha Fin:</strong> {miContratoInfo.contract_end_date}</p>
                                <p><strong>Alquiler Mensual:</strong> {miContratoInfo.monthly_rent}€</p>
                                <p>Esta es la pantalla donde podrás ver los términos y condiciones de tu contrato de alquiler.</p>
                            </div>
                        ) : (
                            <p>No tienes un contrato asignado o hubo un problema al cargarla.</p>
                        )}
                    </div>
                );
            case "mis_incidencias":
                return (
                    <div>
                        <h3>Mis Incidencias</h3>
                        <p>Tienes **{totalMisIncidencias}** incidencias abiertas.</p>
                        <p>Aquí podrás consultar el estado de tus incidencias reportadas y crear nuevas.</p>
                        <button className="btn btn-primary mt-3">Reportar Nueva Incidencia</button>
                    </div>
                );
            case "perfil":
                return (
                    <div>
                        <h3>Mi Perfil</h3>
                        <p>Aquí podrás ver y editar la información de tu perfil de usuario.</p>
                        {store.user ? (
                            <>
                                <p><strong>Nombre:</strong> {store.user.first_name} {store.user.last_name}</p>
                                <p><strong>Email:</strong> {store.user.email}</p>
                                <p><strong>Teléfono:</strong> {store.user.phone}</p>
                                <p><strong>DNI:</strong> {store.user.national_id}</p>
                                <p><strong>Rol:</strong> {store.user.role}</p>
                            </>
                        ) : (
                            <p>Cargando información del perfil...</p>
                        )}
                    </div>
                );
            default:
                return (
                    <div className="text-center w-100">
                        <h2 className="mb-4">Bienvenido, inquilino</h2>
                        <p className="mb-4">Desde aquí puedes consultar tu información personal, los detalles de tu vivienda y tu contrato, así como gestionar tus solicitudes.</p>

                        <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
                            <button className="btn btn-primary btn-lg" onClick={() => setActiveOption("mis_incidencias")}>Reportar Incidencia</button>
                            <button className="btn btn-secondary btn-lg" onClick={() => setActiveOption("mi_vivienda")}>Ver Mi Vivienda</button>
                            <button className="btn btn-info btn-lg" onClick={() => setActiveOption("mi_contrato")}>Ver Mi Contrato</button>
                        </div>

                        <div id="inquilinoCarouselDark" className="carousel carousel-dark slide mt-5 mx-auto" style={{ maxWidth: '800px' }} data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#inquilinoCarouselDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#inquilinoCarouselDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#inquilinoCarouselDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active" data-bs-interval="5000">
                                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                                        <div className="text-center">
                                            <h1 className="display-4">{miViviendaInfo ? '1' : '0'}</h1>
                                            <p className="lead">Mi Vivienda Asignada</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item" data-bs-interval="5000">
                                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                                        <div className="text-center">
                                            <h1 className="display-4">{miContratoInfo ? '1' : '0'}</h1>
                                            <p className="lead">Mi Contrato Activo</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item" data-bs-interval="5000">
                                    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                                        <div className="text-center">
                                            <h1 className="display-4">{totalMisIncidencias}</h1>
                                            <p className="lead">Mis Incidencias Abiertas</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#inquilinoCarouselDark" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Anterior</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#inquilinoCarouselDark" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Siguiente</span>
                            </button>
                        </div>

                        <div className="row mt-4 justify-content-center">
                            <div className="col-md-4 mb-3">
                                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                                        <h1 className="display-4">{miViviendaInfo ? '1' : '0'}</h1>
                                        <p className="lead mb-0">Mi Vivienda</p>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Consulta los detalles de la vivienda que tienes asignada.</p>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveOption("mi_vivienda")}>Ver Detalles</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                                        <h1 className="display-4">{miContratoInfo ? '1' : '0'}</h1>
                                        <p className="lead mb-0">Mi Contrato</p>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Revisa los términos y la duración de tu contrato de alquiler.</p>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveOption("mi_contrato")}>Ver Detalles</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                    <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                                        <h1 className="display-4">{totalMisIncidencias}</h1>
                                        <p className="lead mb-0">Mis Incidencias</p>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Reporta nuevos problemas o consulta el estado de los existentes.</p>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveOption("mis_incidencias")}>Ver Incidencias</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
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
                                    ${location.pathname === item.path && activeOption === item.internalOption ? 'active-sidebar-link' : 'text-white'}`}
                                    onClick={(e) => {
                                        if (item.path === location.pathname && activeOption === item.internalOption && item.path !== "/acceso") {
                                            e.preventDefault();
                                        }
                                        setActiveOption(item.internalOption);
                                        if (item.path !== location.pathname || item.name === "Salir") {
                                            navigate(item.path);
                                        }
                                        if (item.name === "Salir") {
                                            localStorage.removeItem("jwt-token");
                                            // dispatch({ type: "clear_user_data" }); // Considera una acción para limpiar el store
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
                    <div className="p-2 border rounded bg-light">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquilinoIndex;