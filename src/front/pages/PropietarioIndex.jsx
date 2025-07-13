import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import { Issues } from "../fecht_issues.js";


const PropietarioIndex = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalViviendas, setTotalViviendas] = useState();
  const [totalContratos, setTotalContratos] = useState();
  const [totalIncidencias, setTotalIncidencias] = useState();
  const { store, dispatch } = useGlobalReducer();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {

       // const data = await users.getUserApartmentsCount(store.todos.id, store.token);
       const data =await apartments.getApartment(store.token)
     console.log("apartamntos",data)
        if (data.total === null) {
          setTotalViviendas(0);
        }
        else {
          setTotalViviendas(data.total)
        };
      } catch (error) {
        console.error("Error al cargar total de viviendas", error);
        setTotalViviendas(0);
      }

      try {

        const data = await users.getUserContractsCount(store.todos.id, store.token);
        console.log(data.total)
        if (data.error === "No hay contratos para este usuario") {
          setTotalContratos(0)
        }
        else {
          setTotalContratos(data.total)
        };

      } catch (error) {
        console.error("Error al cargar total de contratos", error);
        setTotalContratos(0);
      }

     try {
 
         const data = await Issues.getIssuesOpened(store.token);
         if (data.total === null){
          setTotalIncidencias(0);
         }else{
          setTotalIncidencias(data.total);
         }
         
       } catch (error) {
         console.error("Error al cargar total de incidencias", error);
         setTotalIncidencias(0);
       }
    };
    fetchData();
  }, []);




  const renderContent = () => { };

  return (
    <div className="container-fluid mt-4">
      <div className="row">

        <div className="col-md-12">
          <div className="p-4 border rounded bg-light">
            <h2 className="mb-4">Bienvenido, propietario</h2>
            <p className="mb-4">Gestiona tu inmueble desde este panel.</p>


            <div id="carouselExampleDark" className="carousel carousel-dark slide mt-5 mx-auto" style={{ maxWidth: '800px' }} data-bs-ride="carousel">
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

            <div className="row mt-4 justify-content-center">
              <div className="col-md-4 mb-3">
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="p-4" style={{ backgroundColor: "#e3f2fd", borderBottom: "1px solid #ccc" }}>
                    <h1 className="display-4">{totalViviendas}</h1>
                    <p className="lead mb-0">Total de Viviendas</p>
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
          </div>
        </div>
      </div>

    </div>

  );



  return (

    <div className="container-fluid mt-3 px-3">
      <div className="row">
        <MenuLateral setActiveOption={setActiveOption} />


        <div className="col-md-9">
          <div className="p-2 border rounded bg-light">
            {renderContent()}
          </div>


        </div>
      </div>
    </div>
  )


};

export default PropietarioIndex;

