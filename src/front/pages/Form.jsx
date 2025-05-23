import React from "react";

const Form = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Formulario de ejemplo</h2>

      <div className="mb-3">
        <label htmlFor="formGroupExampleInput" className="form-label">
          Etiqueta de ejemplo
        </label>
        <input
          type="text"
          className="form-control"
          id="formGroupExampleInput"
          placeholder="Ejemplo de input placeholder"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="formGroupExampleInput2" className="form-label">
          Otra etiqueta
        </label>
        <input
          type="text"
          className="form-control"
          id="formGroupExampleInput2"
          placeholder="Otro input placeholder"
        />
      </div>
    </div>
  );
};

export default Form;

