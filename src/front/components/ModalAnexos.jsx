import React from "react";

export default function ModalAnexos({ visible, onClose, anexos, setAnexos }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAnexos((prev) => [...prev, ...files]);
  };
  const handleDelete = (index) => {
    const nuevosAnexos = [...anexos];
    nuevosAnexos.splice(index, 1);
    setAnexos(nuevosAnexos);
  };




  return (
    <div
      className="container py-5"
      style={{
        maxWidth: 800,
        position: !visible ? "absolute" : "relative",
        top: !visible ? "-9999px" : "auto",
        left: !visible ? "-9999px" : "auto",
        opacity: !visible ? 0 : 1,
        pointerEvents: !visible ? "none" : "auto",
      }}
    >
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Añadir anexos al contrato</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="file"
              className="form-control"
              multiple
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            {anexos.length > 0 && (
              <ul className="mt-3 list-group">
                {anexos.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {file.name}
                     <button class="btn btn-danger"
                style={{ marginLeft: "10px" }}
                onClick={() => handleDelete(index)}
              >
                Eliminar
              </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
           
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
