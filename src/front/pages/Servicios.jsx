import React from "react";

const Services = () => {
    return (
        <div className="container mt-5">
            <style>{`
                .service-card {
                    background-color: #ffffff;
                    border: 1px solid #dee2e6;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s ease;
                }

                .service-card:hover {
                    transform: translateY(-5px);
                }

                .service-icon {
                    font-size: 2rem;
                    color: #007bff;
                }

                .service-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1rem;
                }

                .service-desc {
                    color: #6c757d;
                }
            `}</style>

            <h2 className="text-center mb-4">Nuestros Servicios</h2>
            <div className="row g-4">
                {services.map((service, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="service-card text-center h-100">
                            <div className="service-icon">{service.icon}</div>
                            <div className="service-title">{service.title}</div>
                            <p className="service-desc">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const services = [
    {
        icon: "🏠",
        title: "Gestión de Propiedades",
        description: "Manejamos el alquiler, mantenimiento y documentación legal de propiedades."
    },
    {
        icon: "📊",
        title: "Reportes Financieros",
        description: "Recibe reportes detallados de ingresos, gastos y rendimientos de tus propiedades."
    },
    {
        icon: "🛠️",
        title: "Servicios de Mantenimiento",
        description: "Coordinamos y gestionamos el mantenimiento preventivo y correctivo."
    }
];

export default Services;
