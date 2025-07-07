import React, { useEffect } from "react"
import viviendaUrl from "../assets/img/vivienda2.jpg"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Card from "../components/Card.jsx"
import 'animate.css'; 
import { Link } from "react-router-dom";
import photoweb from "../assets/img/viviendasm.webp";
import family from "../assets/img/familia.webp"
import incidencias from "../assets/img/incidencia.webp"


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
                       Montoria sl.
                    </h1>
                    <p className="lead mb-4 mx-auto animate__animated animate__fadeInUp" style={{ maxWidth: '700px' }}>
                        Promoción, Gestión y Alquiler de Inmuebles.
                    </p>
                   {/* <Link 
                        to="/Acceso" 
                        className="btn btn-primary btn-lg shadow-sm animate__animated animate__zoomIn"
                    >
                        Empieza Ahora
                    </Link>*/}
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
                                image={photoweb}
                                text="Promoción de Nuevas Viviendas"
                                text2="Promoción exclusiva que combina hogares confortables, locales comerciales que impulsan el barrio y prácticos trasteros para tu día a día."
                                alt="Propiedad para Arrendador"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                            <Card
                                image={family}
                                text="Viviendas, Locales y Trasteros en Alquiler"
                                text2="Alquila con nosotros: viviendas, locales y trasteros gestionados por Montoria, sin intermediarios."
                                alt="Propiedad para Arrendatario"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4 d-flex justify-content-center">
                            <Card
                                image={incidencias}
                                text="Servicios Digitalizados"
                                text2="Contratos digitales, reporte inmediato de incidencias y una comunicación ágil con nuestro equipo, todo desde tu dispositivo."
                                alt="Servicios Digitales"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
