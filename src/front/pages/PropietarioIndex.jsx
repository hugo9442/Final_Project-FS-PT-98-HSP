import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuLateral from "../components/MenuLateral";


const PropietarioIndex = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalViviendas, setTotalViviendas] = useState(0);
  const [totalContratos, setTotalContratos] = useState(0);
  const [totalIncidencias, setTotalIncidencias] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/viviendas/count");
        const data = await res.json();
        setTotalViviendas(data.total);
      } catch (error) {
        console.error("Error al cargar total de viviendas", error);
        setTotalViviendas(10);
      }

      try {
        const res = await fetch("/api/contratos/count");
        const data = await res.json();
        setTotalContratos(data.total);
      } catch (error) {
        console.error("Error al cargar total de contratos", error);
        setTotalContratos(1);
      }

      try {
        const res = await fetch("/api/incidencias/count");
        const data = await res.json();
        setTotalIncidencias(data.total);
      } catch (error) {
        console.error("Error al cargar total de incidencias", error);
        setTotalIncidencias(7);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      alert(`Archivo seleccionado: ${selectedFile.name}`);
    } else {
      alert("Por favor, selecciona un archivo PDF.");
    }
  };

  const renderContent = () => {
    switch (activeOption) {
      case "contrato":
        return (
          <div>
            <h5>Aquí puedes registrar un nuevo contrato.</h5>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="pdfUpload" className="form-label">
                  Sube tu contrato en PDF
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Guardar Contrato
              </button>
            </form>
          </div>
        );
      case "apartamentos":
        return <p>Listado y gestión de apartamentos.</p>;
      case "contactos":
        return <p>Gestión de contactos y clientes.</p>;
      case "incidencias":
        return <p>Historial y reporte de incidencias.</p>;
      case "perfil":
        return <p>Información de perfil del usuario.</p>;
      case "salir":
        navigate("/acceso");
        return null;
      default:
        return (
          <div className="text-center">
            <h2>Bienvenido, propietario</h2>
            <p>Gestiona tu inmueble desde este panel.</p>

            <button className="btn btn-primary btn-lg">Registra Inquilino</button>
            <button className="btn btn-primary btn-lg m-3">Registra Vivienda</button>
            <button className="btn btn-primary btn-lg">Registra Incidencia</button>

            {/* Carrusel */}
            <div id="carouselExampleDark" className="carousel carousel-dark slide mt-5" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="5000">
                  <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                    <div className="text-center">
                      <h1 className="display-4">{totalViviendas}</h1>
                      <p className="lead">Total de Viviendas Registradas</p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="5000">
                  <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                    <div className="text-center">
                      <h1 className="display-4">{totalContratos}</h1>
                      <p className="lead">Total de Contratos Activos</p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="5000">
                  <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "200px" }}>
                    <div className="text-center">
                      <h1 className="display-4">{totalIncidencias}</h1>
                      <p className="lead">Total de Incidencias Abiertas</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container-fluid mt-3 px-3">
      <div className="row">
        {/* Menú lateral izquierdo */}
       <MenuLateral setActiveOption={setActiveOption} />


        {/* Contenido principal + cards */}
        <div className="col-md-9">
          <div className="p-2 border rounded bg-light">
            {/* Contenido dinámico */}
            {renderContent()}
          </div>

          {/* Cards fuera del carrusel, solo si estamos en "Principal" */}
          {activeOption === null && (
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                    <h1 className="display-4">{totalViviendas}</h1>
                    <p className="lead mb-0">Total de Inquilinos</p>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Gestión completa de tus inquilinos.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                    <h1 className="display-4">{totalContratos}</h1>
                    <p className="lead mb-0">Total de Contratos Activos</p>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Consulta y edición de viviendas.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                    <h1 className="display-4">{totalIncidencias}</h1>
                    <p className="lead mb-0">Total de Incidencias Abiertas</p>
                  </div>
                  <div className="card-body">
                    <p className="card-text">Revisión de problemas y reportes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );


};

export default PropietarioIndex;
