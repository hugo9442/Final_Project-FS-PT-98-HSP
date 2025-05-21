import { Link } from "react-router-dom";

const Navbar = () => {

	return (
		<nav className="navbar shadow sticky-top" data-bs-theme="dark" style={{
			backgroundColor: "rgba(138, 223, 251, 0.8)",
			boxShadow: "0 3px 25px rgba(0, 0, 0, 0.3)",
			borderRadius: "13px"
		}}
		>
			<img src="src/front/assets/img/LogoTrabajoFinal.png" alt="Logo" className="navbar-brand ms-5" style={{ width: "70px", height: "70px" }} />
			<div className="d-flex gap-3">
				<Link to="/" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Inicio</Link>
				<Link to="/contacto" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Contacto</Link>
				<Link to="/" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>Servicios</Link>
				<Link to="/Acceso" className="btn btn-light btn-sm w-100 me-5" style={{ minWidth: "120px" }}>Acceso</Link>
			</div>
		</nav>
	);
};


export default Navbar;

