import { Link,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/LogoTrabajoFinal.png";
import { useRef } from "react"; // Importamos useRef
import conforrent from "../assets/img/conforrent.png"

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const history = useNavigate();
  const navbarCollapseRef = useRef(null); // Referencia para el menú colapsable
  const navigate=useNavigate()
  const handleNavigatePropietarioIndex = () => history("/propietarioindex");
  const handleNavigateAcceso = () => history("/Acceso");
  const location = useLocation();

  // Función para cerrar el menú colapsable
  const closeNavbar = () => {
    if (navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.remove("show");
    }
  };

  const accessToPropietarioIndex = () => {
    closeNavbar(); // Cerramos el menú al hacer clic
    if (store.token && store.todos.role==="INQUILINO") {
      
        navigate("/InquilinoIndex")
    
     
    } else if  (store.token && store.todos.role==="ADMIN" || store.todos.role==="PROPIETARIO"){
       handleNavigatePropietarioIndex();
    } else{
       handleNavigateAcceso();
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow"
      data-bs-theme="dark"
     style={{
        backgroundColor: "#F2F2F2" ,
        boxShadow: "0 3px 25px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand ms-3" onClick={closeNavbar}>
          <img
            src={conforrent}
            alt="Logo"
            style={{ width: "100px", height: "70px" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div 
          className="collapse navbar-collapse" 
          id="navbarNav"
          ref={navbarCollapseRef} // Asignamos la referencia
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-2 me-3">
            <li className="nav-item">
             {location.pathname !== "/" && (
        <Link
          to="/"
          className="btn btn-orange btn-sm w-100"
          style={{ minWidth: "120px" }}
          onClick={closeNavbar} // Cerramos al hacer clic
        >
          Inicio
        </Link>
      )}
            </li>
            <li className="nav-item">
              <Link 
                to="/Contact" 
                className="btn btn-orange btn-sm w-100" 
                style={{ minWidth: "120px" }}
                onClick={closeNavbar} // Cerramos al hacer clic
              >
                Contacto
              </Link>
            </li>
           { /*<li className="nav-item">
              <Link 
                to="/Servicios" 
                className="btn btn-orange btn-sm w-100" 
                style={{ minWidth: "120px" }}
                onClick={closeNavbar} // Cerramos al hacer clic
              >
                Servicios
              </Link>
            </li>*/}
            <li className="nav-item">
              <button 
                className="btn btn-orange btn-sm w-100 me-5" 
                style={{ minWidth: "120px",  }} 
                onClick={accessToPropietarioIndex}
              >
                Acceso
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;