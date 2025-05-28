import React from "react";

import MenuLateral from "../components/MenuLateral";


const Viviendas = () => {
    return (
        <>


            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Menú lateral */}
                    <MenuLateral setActiveOption={() => { }} />

                    {/* Contenido principal */}
                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Viviendas</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar viviendas activas.</p>
                            {/* Puedes incluir aquí un formulario o visor PDF */}
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Viviendas;