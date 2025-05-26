import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarMenu = () => {
    const navigate = useNavigate();

    return (
        <div className="col-md-3">
            <div className="btn-group-vertical w-100 gap-2" role="group">
                <button className="btn btn-outline-primary" onClick={() => navigate("/Contrato")}>Contrato</button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/Viviendas")}>Viviendas</button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/Inquilinos")}>Inquilinos</button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/Incidencias")}>Incidencias</button>
            </div>
        </div>
    );
};

export default SidebarMenu;
