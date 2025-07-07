import { Outlet, useLocation } from "react-router-dom";
import NavbarPrivate from "../components/NavbarPrivate";
import Navbar from "../components/Navbar";
import NavbarSecondary from "../components/NavbarSecondary";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import MenuLateral from "../components/MenuLateral"; // Importa tu sidebar

import { useState } from "react";

{/*export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    const privateRoutes = ["/admin", "/Contrato", "/Viviendas", "/Inquilinos", "/Alquileres",
                             "/Incidencias", "/propietarioindex", "/single","/Gestiondocumental","/Gestiondocumentalvista","/Facturacion", "/Facturacionvista"];
    const secondaryRoutes = ["/inquilinoindex"];
    const publicRoutes = ["/contact", "/acceso", "/servicios"];

    const showPrivateNavbar = privateRoutes.some(route => path.startsWith(route));
    const showSecondaryNavbar = secondaryRoutes.some(route => path.startsWith(route));
    const showPublicNavbar = !showPrivateNavbar && !showSecondaryNavbar && publicRoutes.every(route => !path.startsWith(route));

    const [activeOption, setActiveOption] = useState(null);

    return (
        <ScrollToTop>
            {showPublicNavbar && <Navbar />}
            {showSecondaryNavbar && <NavbarSecondary />}

             <div className="d-flex">
               {showPrivateNavbar && (
                    <MenuLateral setActiveOption={setActiveOption} />
                )}
                     
                <div
                    style={{
                        padding: "1rem",
                        width: "100%",
                        marginLeft: showPrivateNavbar ? "250px" : "0px",
                    }}
                >
                    <Outlet  />
                </div>
            </div>

            <Footer />
        </ScrollToTop>
    );
}; */}

export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    const privateRoutes = ["/admin", "/Contrato", "/Viviendas", "/Inquilinos", "/Alquileres",
        "/Incidencias", "/propietarioindex", "/single","/Gestiondocumental","/Gestiondocumentalvista","/Facturacion", "/Facturacionvista"];
    const secondaryRoutes = ["/inquilinoindex"];
    const publicRoutes = ["/contact", "/acceso", "/servicios"];

    const showPrivateNavbar = privateRoutes.some(route => path.startsWith(route));
    const showSecondaryNavbar = secondaryRoutes.some(route => path.startsWith(route));
    const showPublicNavbar = !showPrivateNavbar && !showSecondaryNavbar && publicRoutes.every(route => !path.startsWith(route));

    const [activeOption, setActiveOption] = useState(null);

    return (
        <ScrollToTop>
            {showPublicNavbar && <Navbar />}
            {showSecondaryNavbar && <NavbarSecondary />}

            {showPrivateNavbar && (
                <MenuLateral setActiveOption={setActiveOption} />
            )}

            <div className="main-content p-4 mt-4">
                <Outlet />
            </div>

            <Footer />
        </ScrollToTop>
    );
};


