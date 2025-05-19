import { Link } from "react-router-dom";

const Navbar = () => {

	return (
		<nav className="navbar bg-primary" data-bs-theme="dark">
			<img src="#" alt="Logo" className="navbar-brand ms-5" style={{ width: "100px", height: "50px" }} />
			<div className="d-flex gap-3">
					<Link to="/" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Inicio</Link>
					<Link to="/contacto" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Contacto</Link>
					<Link to="/servicios" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Servicios</Link>
					<Link to="/acceso" className="btn btn-light btn-sm w-100 me-5" style={{ minWidth: "120px" }}>Acceso</Link>
				</div>
		</nav>
	);
};


export default Navbar;

