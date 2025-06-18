import React from "react";
// Si vas a usar iconos de FontAwesome, importarlos aquí:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faChartLine, faWrench, faUserCheck, faFileContract, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
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
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h2 className="display-4 fw-bold mb-3" style={{ color: '#0056b3' }}>Nuestros Servicios</h2>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
                    En <strong>InmuGestion</strong>, nos dedicamos a resolver el desafío de la gestión de inmuebles y alquileres. Nuestra plataforma te permite centralizar y simplificar la administración de todas las partes relacionadas: propietarios, inquilinos, contratos y, por supuesto, las incidencias. Diseñamos soluciones intuitivas para que tu experiencia sea fluida y eficiente, liberándote del estrés de la gestión manual.
                </p>
            </div>

            <div className="row g-4 justify-content-center">
                {servicesList.map((service, index) => (
                    <div className="col-md-6 col-lg-6 col-xl-3" key={index}>
                        <div className="card h-100 shadow-sm border-0 transform-on-hover">
                            <div className="card-body text-center p-4">
                                <div className="service-icon display-4 mb-3" style={{ color: '#0056b3' }}>
                                    {service.icon}
                                </div>
                                <h5 className="service-title fw-bold mb-2">{service.title}</h5>
                                <p className="service-desc text-muted">{service.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
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
                    color: #007bff; /* Color principal de Bootstrap si no se define en FontAwesome */
                }
            `}</style>
        </div>
    );
};

export default Services;