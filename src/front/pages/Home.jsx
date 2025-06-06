import React, { useEffect } from "react"
import viviendaUrl from "../assets/img/vivienda2.jpg" // Imagen principal para el Hero Section
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Card from "../components/Card.jsx" // Tu componente Card existente


export const Home = () => {
    const { dispatch } = useGlobalReducer()

    const loadMessage = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL

            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

            const response = await fetch(backendUrl + "/api/hello")
            const data = await response.json()

            if (response.ok) dispatch({ type: "set_hello", payload: data.message })

            return data

        } catch (error) {
            if (error.message) throw new Error(
                `Could not fetch the message from the backend.
                Please check if the backend is running and the backend port is public.`
            );
        }
    }

    useEffect(() => {
        loadMessage()
    }, [])

    return (
        <div>
            <section
                className="hero-section d-flex align-items-center text-white text-center"
                style={{
                    backgroundImage: `url(${viviendaUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 70px)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 0, 
                }}></div>

                <div className="container position-relative z-1 py-5">
                    <h1 className="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
                        Tu Gestión Inmobiliaria, Simplificada.
                    </h1>
                    <p className="lead mb-4 mx-auto animate__animated animate__fadeInUp" style={{ maxWidth: '700px' }}>
                        Centraliza y optimiza la administración de tus propiedades y alquileres.
                        Desde la gestión de contratos hasta el seguimiento de incidencias,
                        todo en un solo lugar.
                    </p>
                    <button className="btn btn-primary btn-lg shadow-sm animate__animated animate__zoomIn">
                        Empieza Ahora
                    </button>
                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-4" style={{ color: '#0056b3' }}>
                        ¿Cómo te ayudamos?
                    </h2>
                    <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '800px' }}>
                        Ofrecemos soluciones integrales para propietarios e inquilinos,
                        transformando la gestión de inmuebles en una experiencia sencilla y eficiente.
                    </p>

                    <div className="row justify-content-center g-4">
                        <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                            <Card
                                image="src/front/assets/img/viviendasm.webp"
                                text="Arrendador: Control Total"
                                text2="Visualiza y gestiona incidencias reportadas por inquilinos. Centraliza contratos, propiedades e inquilinos. Soluciones rápidas y cómodas para una administración sin estrés."
                                alt="Propiedad para Arrendador"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                            <Card
                                image="src/front/assets/img/familia.webp"
                                text="Arrendatario: Simplicidad y Comodidad"
                                text2="Reporta incidencias fácilmente desde cualquier lugar. Olvídate de llamadas: tu arrendador recibe y gestiona todo online, rápido y sin complicaciones."
                                alt="Propiedad para Arrendatario"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                            <Card
                                image="src/front/assets/img/incidencia.webp"
                                text="Servicios Digitalizados"
                                text2="Digitaliza la gestión de tu vivienda: seguimiento de incidencias, comunicación ágil y soluciones eficientes para propietarios e inquilinos, todo en un solo lugar."
                                alt="Servicios Digitales"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Puedes añadir más secciones aquí si lo deseas (Testimonios, Precios, etc.) */}

        </div>
    );
};

// Notas importantes sobre tu componente `Card.jsx`:
// Para que las Cards se vean elegantes como lo hemos hecho en Contacto y Servicios,
// tu componente `Card.jsx` debería tener una estructura similar a esta:
/*
// components/Card.jsx
import React from 'react';

const Card = ({ image, text, text2, alt }) => {
    return (
        <div className="card h-100 shadow-sm border-0 transform-on-hover" style={{ maxWidth: '350px' }}>
            {image && ( // Renderiza la imagen solo si se proporciona
                <img src={image} className="card-img-top p-3" alt={alt || 'Card image'} style={{ objectFit: 'cover', height: '180px' }} />
            )}
            <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fw-bold" style={{ color: '#0056b3' }}>{text}</h5> // Título de la tarjeta en azul oscuro
                <p className="card-text text-muted flex-grow-1">{text2}</p>
                // Puedes añadir un botón o enlace aquí si la tarjeta necesita una acción
            </div>
        </div>
    );
};

export default Card;
*/

// Y asegúrate de que el CSS para 'transform-on-hover' esté disponible globalmente o en un archivo CSS importado.
// Ejemplo de CSS:
/*
.transform-on-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
    transition: all 0.3s ease-in-out;
}
.transform-on-hover {
    transition: all 0.3s ease-in-out;
}
*/