import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import NavbarPrivate from "../components/NavbarPrivate";
import { Footer } from "../components/Footer";


export const Layout = () => {
    const location = useLocation();

    const privateRoutes = ["/PropietarioIndex", "/admin"];
    const publicRoutes = ["/acceso", "/Form"];

    const path = location.pathname;

    const showPrivateNavbar = privateRoutes.includes(path);
    const showPublicNavbar = !publicRoutes.includes(path) && !showPrivateNavbar;

    return (
        <ScrollToTop>
            {showPublicNavbar && <Navbar />}
            {showPrivateNavbar && <NavbarPrivate />}
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
