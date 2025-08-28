
import 'bootstrap/dist/css/bootstrap.min.css';
import conforrent from "../assets/img/conforrent.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faChartLine, faWrench, faUserCheck, faFileContract, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Suscription from "../components/Suscriptions.jsx";


export default function LandingPage() {
    const servicesList = [
        {
            icon: <FontAwesomeIcon icon={faHouseChimney} />,
            title: "Gestión Integral de Propiedades",
            description: "Centraliza toda la información de tus inmuebles, desde detalles de la propiedad hasta su estado actual y documentación. Olvídate del papeleo y ten todo a mano en un solo lugar, optimizando tu tiempo y recursos."
        },
        {
            icon: <FontAwesomeIcon icon={faUserCheck} />,
            title: "Administración de Inquilinos y Contratos",
            description: "Facilitamos la gestión de las relaciones con tus inquilinos, la creación y seguimiento de contratos de alquiler. Registra nuevos inquilinos, gestiona sus invitaciones y mantén un historial claro de cada acuerdo."
        },
        {
            icon: <FontAwesomeIcon icon={faTriangleExclamation} />,
            title: "Gestión Eficiente de Incidencias",
            description: "Reporta, asigna y da seguimiento a cualquier problema o incidencia en tus propiedades. Mantén un registro claro de cada evento, desde el reporte inicial hasta su resolución, garantizando el bienestar de tus inquilinos y el buen estado del inmueble."
        },
        {
            icon: <FontAwesomeIcon icon={faChartLine} />,
            title: "Control Financiero y Contable",
            description: "Registra tus ingresos y gastos de alquiler de forma sencilla. Genera reportes financieros que te ayudarán a tener una visión clara de la rentabilidad de tus inversiones inmobiliarias."
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="hero text-center  py-5" style={{ backgroundColor: "#F2F2F2" }}>
                <div className="container">
                    <img
                        src={conforrent}
                        alt="conforrent"
                        style={{ width: "800px", marginBottom: "20px" }}
                    />
                    <h1 className="fw-bold">
                        Gestión de propiedades simple, rápida y profesional
                    </h1>
                    <p className="lead">
                        Automatiza contratos, incidencias, facturas y cobros en un solo lugar.
                    </p>
                    <a href="#" className="btn btn-orange btn-lg me-2">
                        Probar gratis
                    </a>
                    <a href="#" className="btn btn-outline-orange btn-lg">
                        Ver demo
                    </a>
                </div>
            </section>

            {/* Beneficios */}
            <section className="py-5" >
                { /*<div className="container">
                    <div className="row text-center">
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">🏠</div>
                            <h5 className="fw-bold">Centraliza la gestión</h5>
                            <p>Viviendas, contratos, incidencias y gastos en un solo dashboard.</p>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">📑</div>
                            <h5 className="fw-bold">Automatiza contratos</h5>
                            <p>Genera, firma y guarda contratos con anexos y DocuSign.</p>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">💸</div>
                            <h5 className="fw-bold">Cobra y factura fácil</h5>
                            <p>
                                Integrado con Stripe y preparado para Veri*factu (Ley Antifraude).
                            </p>
                        </div>
                    </div>
                </div>*/}
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {servicesList.map((service, index) => (
                            <div className="col-md-6 col-lg-6 col-xl-3" key={index}>
                                <div className="card h-100 shadow-sm border-0 transform-on-hover">
                                    <div className="card-body text-center p-4">
                                        <div className="service-icon display-4 mb-3" style={{ color: '#FF6F00' }}>
                                            {service.icon}
                                        </div>
                                        <h5 className="service-title fw-bold mb-2">{service.title}</h5>
                                        <p className="service-desc text-muted">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <style>{`
                .transform-on-hover:hover {
                    transform: translateY(-8px); /* Desplaza la tarjeta ligeramente hacia arriba */
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important; /* Sombra más pronunciada */
                    transition: all 0.3s ease-in-out;
                }
                .transform-on-hover {
                    transition: all 0.3s ease-in-out; /* Transición por defecto para suavidad */
                }
                /* Ajustes de color para iconos si no usas FontAwesome */
                .service-icon {
                    color: #FF6F00; /* Color principal de Bootstrap si no se define en FontAwesome */
                }
            `}</style>
            </section>

            {/* Cómo funciona */}
            <section className="py-5  text-center" style={{ backgroundColor: "#F2F2F2" }}>
                <div className="container">
                    <h3 className="fw-bold mb-5">Cómo funciona</h3>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">🏡</div>
                            <h5>Crea tus propiedades</h5>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">👥</div>
                            <h5>Invita a inquilinos y contratistas</h5>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-icon mb-3">📊</div>
                            <h5>Gestiona todo desde el panel</h5>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonio */}
            <section className="py-5 text-center">
                <div className="container">
                    <blockquote className="blockquote">
                        <p>
                            “Con esta herramienta gestiono 40 propiedades sin papeles ni Excel.
                            Ahorro horas cada semana.”
                        </p>
                        <footer className="blockquote-footer">Gestor inmobiliario</footer>
                    </blockquote>
                </div>
            </section>

            {/* Planes de precios */}

            <section className="pricing  py-5 text-center" style={{ backgroundColor: "#EDEDED" }}>
                <div className="container">
                    <Suscription />

                </div>
            </section>


        </>
    );
}


