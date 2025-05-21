import React from "react";

const ButtonGroupDropdown = () => {
  return (
    <div className="btn-group" role="group" aria-label="Button group with nested dropdown">

      <div className="btn-group" role="group">
        <button
          type="button"
          className="btn btn-primary dropdown-toggle m-3"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Dropdown
        </button>

        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="#">
              Registrar Contrato
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Apartamentos
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Contactos
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Incidencias
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Perfil
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Salir
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ButtonGroupDropdown;
