import { useLocation, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import NavbarPrivate from "../components/NavbarPrivate";
import NavbarSecondary from "../components/NavbarSecondary";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";



export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    const privateRoutes = ["/PropietarioIndex", "/admin", "/InquilinoIndex", "/Contrato", "/Viviendas", "/Inquilinos", "/Incidencias"];
    const secondaryRoutes = ["/InquilinoIndex"];
    const publicRoutes = ["/acceso", "/Form"];

    const showPrivateNavbar = privateRoutes.includes(path);
    const showSecondaryNavbar = secondaryRoutes.includes(path);
    const showPublicNavbar = !showPrivateNavbar && !showSecondaryNavbar && !publicRoutes.includes(path);

    return (
        <ScrollToTop>
            {showPublicNavbar && <Navbar />}
            
            {showSecondaryNavbar && <NavbarSecondary />}
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
