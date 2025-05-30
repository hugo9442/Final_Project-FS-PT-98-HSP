import React, { useState } from "react";
import MenuLateral from "../components/MenuLateral";

const InquilinoIndex = () => {
    const [activeOption, setActiveOption] = useState(null);
    
    const renderContent = () => {
        switch (activeOption) {
            case "contrato":
                return <p>Aquí puedes ver tu contrato actual.</p>;
            case "viviendas":
                return <p>Detalle de tu vivienda asignada.</p>;
            case "inquilinos":
                return <p>Información de otros inquilinos en el sistema.</p>;
            case "incidencias":
                return <p>Reporta o consulta tus incidencias.</p>;
            default:
                return (
                    <div className="text-center">
                        <h2>Bienvenido, inquilino</h2>
                        <p>Desde aquí puedes consultar tu información.</p>
                    </div>
                );
        }
    };

    return (
        <div className="container-fluid mt-3 px-3">
            <div className="row">
                {/* Menú lateral izquierdo */}
                <MenuLateral setActiveOption={setActiveOption} />

                {/* Contenido principal */}
                <div className="col-md-9">
                    <div className="p-3 border rounded bg-light">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquilinoIndex;
