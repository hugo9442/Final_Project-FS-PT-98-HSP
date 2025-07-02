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
  faBars
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  "gauge-high": faGaugeHigh,
  "house-chimney": faHouseChimney,
  "file-signature": faFileSignature,
  "people-roof": faPeopleRoof,
  "triangle-exclamation": faTriangleExclamation,
  "user": faUser,
  "right-from-bracket": faRightFromBracket,
  "bars": faBars,
};

const MenuLateral = ({ setActiveOption }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: "Inicio", path: "/propietarioindex", icon: "gauge-high", internalOption: "Propietarioindex" },
    { name: "Viviendas", path: "/Viviendas", icon: "house-chimney", internalOption: "viviendas" },
    { name: "Alquileres", path: "/Alquileres", icon: "file-signature", internalOption: "Alquileres" },
    { name: "Registro de Inquilinos y Contratos", path: "/Inquilinos", icon: "people-roof", internalOption: "inquilinos" },
    { name: "Incidencias", path: "/Incidencias", icon: "triangle-exclamation", internalOption: "incidencias" },
    {
      name: "Gestión Documental",
      icon: "triangle-exclamation",
      internalOption: "Gestiondocumental",
      dropdown: true,
      items: [
        {
          label: "Añadir",
          action: () => {
            setDropdownOpen(false);
            setIsOpen(false);
            navigate('/Gestiondocumental');
          }
        },
        { label: "Visualizar", action: () => {
            setDropdownOpen(false);
            setIsOpen(false);
            navigate('/Gestiondocumentalvista');
          } }
      ]
    },
   // { name: "Perfil", path: "/Perfil", icon: "user", internalOption: "perfil" },
    { name: "Salir", path: "/", icon: "right-from-bracket", internalOption: "salir" }
  ];

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="d-md-none bg-info p-2 d-flex justify-content-between align-items-center shadow">
        <img src="/assets/img/LogoTrabajoFinal.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <button
          className="btn btn-outline-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={iconMap["bars"]} />
        </button>
      </div>

      <div className={`sidebar-private bg-info-subtle shadow p-3
        ${isOpen ? 'd-block' : 'd-none'} d-md-block`}
        style={{
          width: '250px',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1050,
          paddingTop: '80px',
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/assets/img/LogoTrabajoFinal.png"
            alt="Logo"
            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
            className="mb-2"
          />
          <h5 className="fw-bold text-dark">Panel de Propietario</h5>
          <small className="text-secondary">Gestión Inmuebles</small>
        </div>

        <ul className="nav flex-column">
          {navItems.map((item) => (
            item.dropdown ? (
              <li className="nav-item mb-2" key={item.name} style={{ position: "relative" }}>
                <button
                  className={`btn w-100 text-start ${dropdownOpen ? 'bg-primary text-white' : 'text-dark'}`}
                  onClick={handleDropdownToggle}
                  type="button"
                >
                  <FontAwesomeIcon icon={iconMap[item.icon]} className="me-3" />
                  {item.name}
                </button>
                {dropdownOpen && (
                  <ul
                    className="list-group position-absolute"
                    style={{
                      top: '100%',
                      left: 0,
                      zIndex: 2000,
                      width: '100%',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                    }}
                  >
                    {item.items.map(sub => (
                      <li
                        className="list-group-item list-group-item-action"
                        key={sub.label}
                        onClick={() => {
                          sub.action();
                          setDropdownOpen(false);
                          setIsOpen(false);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li className="nav-item mb-2" key={item.name}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center rounded py-2 px-3
                    ${location.pathname === item.path ? 'bg-primary text-white' : 'text-dark'}`}
                  onClick={(e) => {
                    if (item.path === location.pathname && item.path !== "/acceso") {
                      e.preventDefault();
                    }
                    setActiveOption(item.internalOption);
                    if (item.path !== location.pathname || item.name === "Salir") {
                      navigate(item.path);
                    }
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={iconMap[item.icon]} className="me-3" />
                  {item.name}
                </Link>
              </li>
            )
          ))}
        </ul>
      </div>
    </>
  );
};

export default MenuLateral;
