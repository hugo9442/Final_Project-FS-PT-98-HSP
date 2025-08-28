import React, { useEffect } from "react"
import viviendaUrl from "../assets/img/vivienda2.jpg"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Card from "../components/Card.jsx"
import 'animate.css';
import logo from "../assets/img/LogoTrabajoFinal.png";
import conforrent from "../assets/img/conforrent.png";
import { Link } from "react-router-dom";
import photoweb from "../assets/img/viviendasm.webp";
import family from "../assets/img/familia.webp"
import incidencias from "../assets/img/incidencia.webp"
import Suscription from "../components/Suscriptions.jsx";
import SubscribeButton from "../components/Stripebotton.jsx";


export const Home = () => {

return (
  <div className="font-sans">
    {/* Hero Section */}
    <section className="vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-light">
      <img src={conforrent} alt="Logo"  style={{ width: "700px" }} />
      <h1 className="fw-bold display-5 mb-3">
        Gestiona tus propiedades sin complicaciones
      </h1>
      <p className="fs-5 mb-4">
        Contratos, pagos, incidencias y reportes todo en un mismo lugar
      </p>
      <a
        href="#planes"
        className="btn btn-dark btn-lg px-4 py-2"
      >
        Ver planes
      </a>
    </section>

    {/* Imagen principal */}
    <section className="bg-white py-5 text-center">
      <div className="container">
        <img
          src={viviendaUrl}
          alt="Edificio"
          className="img-fluid rounded shadow"
        />
      </div>
    </section>

    {/* Planes de suscripción */}

    <Suscription />
  </div>
);

};
