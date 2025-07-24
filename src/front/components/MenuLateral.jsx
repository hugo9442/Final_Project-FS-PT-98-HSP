import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGaugeHigh,
  faHouseChimney,
  faFileSignature,
  faPeopleRoof,
  faTriangleExclamation,
  faUser,
  faRightFromBracket,
  faBars,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/img/LogoTrabajoFinal.png";

const iconMap = {
  "gauge-high": faGaugeHigh,
  "house-chimney": faHouseChimney,
  "file-signature": faFileSignature,
  "people-roof": faPeopleRoof,
  "triangle-exclamation": faTriangleExclamation,
  "user": faUser,
  "right-from-bracket": faRightFromBracket,
  "bars": faBars,
  "folderOpen": faFolderOpen,
};

const MenuLateral = ({ setActiveOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDoc, setDropdownDoc] = useState(false);
  const [dropdownFact, setDropdownFact] = useState(false);
  const [dropdownProv, setDropdownProv] = useState(false); 

  const navItems = [
    { name: "Inicio", path: "/propietarioindex", icon: "gauge-high", internalOption: "Propietarioindex" },
    { name: "Viviendas", path: "/Viviendas", icon: "house-chimney", internalOption: "viviendas" },
    { name: "Registro de Inquilinos y Contratos", path: "/Inquilinos", icon: "people-roof", internalOption: "inquilinos" },
    { name: "Alquileres", path: "/Alquileres", icon: "file-signature", internalOption: "Alquileres" },
    { name: "Incidencias", path: "/Incidencias", icon: "triangle-exclamation", internalOption: "incidencias" },
  ];

  return (
    <>
      <div className="d-md-none bg-info p-2 d-flex justify-content-between align-items-center shadow">
        <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
        <button className="btn btn-outline-dark" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={iconMap["bars"]} />
        </button>
      </div>

      <div className={`sidebar-private bg-info-subtle shadow p-3 ${isOpen ? 'd-block' : 'd-none'} d-md-block`}
        style={{
          width: '250px',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1050,
          paddingTop: '80px',
        }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
            className="mb-2"
          />
          <h5 className="fw-bold text-dark">Panel de Propietario</h5>
          <small className="text-secondary">Gestión Inmuebles</small>
        </div>

        <ul className="nav flex-column">
          {navItems.map(item => (
            <li className="nav-item mb-2" key={item.name}>
              <Link to={item.path}
                className={`nav-link d-flex align-items-center rounded py-2 px-3
                ${location.pathname === item.path ? 'bg-primary text-white' : 'text-dark'}`}
                onClick={(e) => {
                  if (item.path === location.pathname && item.path !== "/acceso") e.preventDefault();
                  setActiveOption(item.internalOption);
                  navigate(item.path);
                  setIsOpen(false);
                }}>
                <FontAwesomeIcon icon={iconMap[item.icon]} className="me-3" />
                {item.name}
              </Link>
            </li>
          ))}

          {/* Gestión Documental */}
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${dropdownDoc ? 'bg-primary text-white' : 'text-dark'}`}
              onClick={() => {setDropdownDoc(!dropdownDoc);setDropdownFact(false);setDropdownProv(false)}}>
              <FontAwesomeIcon icon={iconMap["folderOpen"]} className="me-3" />
              Gestión Documental
            </button>
            {dropdownDoc && (
              <ul className="list-group position-relative" style={{
                zIndex: 2000,
                width: '100%',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Gestiondocumental'); setDropdownDoc(false); setIsOpen(false); }}>
                  Añadir
                </li>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Gestiondocumentalvista'); setDropdownDoc(false); setIsOpen(false); }}>
                  Visualizar
                </li>
              </ul>
            )}
          </li>

          {/* Facturación */}
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${dropdownFact ? 'bg-primary text-white' : 'text-dark'}`}
              onClick={() =>{ setDropdownFact(!dropdownFact); setDropdownDoc(false);setDropdownProv(false)}}>
              <FontAwesomeIcon icon={iconMap["folderOpen"]} className="me-3" />
              Facturación
            </button>
            {dropdownFact && (
              <ul className="list-group position-relative" style={{
                zIndex: 2000,
                width: '100%',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Facturacion'); setDropdownFact(false); setIsOpen(false); }}>
                  Facturar
                </li>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Facturacionvista'); setDropdownFact(false); setIsOpen(false); }}>
                  Ver Facturas
                </li>
              </ul>
            )}
          </li>

          {/* Proveedores y Gastos */}
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${dropdownProv ? 'bg-primary text-white' : 'text-dark'}`}
              onClick={() => {setDropdownProv(!dropdownProv);setDropdownDoc(false);setDropdownFact(false)}}>
              <FontAwesomeIcon icon={iconMap["folderOpen"]} className="me-3" />
              Proveedores y Gastos
            </button>
            {dropdownProv && (
              <ul className="list-group position-relative" style={{
                zIndex: 2000,
                width: '100%',
                backgroundColor: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
              }}>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Contractors'); setDropdownProv(false); setIsOpen(false); }}>
                  Proveedores
                </li>
                <li className="list-group-item list-group-item-action" onClick={() => { navigate('/Expenses'); setDropdownProv(false); setIsOpen(false); }}>
                  Gastos
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item mb-2">
            <Link to="/" className="nav-link d-flex align-items-center rounded py-2 px-3 text-dark"
              onClick={() => {
                setActiveOption("salir");
                navigate("/");
                setIsOpen(false);
              }}>
              <FontAwesomeIcon icon={iconMap["right-from-bracket"]} className="me-3" />
              Salir
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MenuLateral;
