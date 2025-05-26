import React from "react";

import MenuLateral from "../components/MenuLateral";


const Incidencias = () => {
    return (
        <>


            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Menú lateral */}
                    <MenuLateral setActiveOption={() => { }} />

                    {/* Contenido principal */}
                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Incidencias</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar incidencias activas.</p>
                            {/* Puedes incluir aquí un formulario o visor PDF */}
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Incidencias;