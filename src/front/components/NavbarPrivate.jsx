import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

	return (
		<nav className="navbar shadow sticky-top" data-bs-theme="dark" style={{
			backgroundColor: "rgba(138, 223, 251, 0.8)",
			boxShadow: "0 3px 25px rgba(0, 0, 0, 0.3)",
			borderRadius: "13px"
		}}
		>

		{/*<a href="/PropietarioIndex" className="ms-5">
				<img
					src="src/front/assets/img/LogoTrabajoFinal.png"
					alt="Logo"
					className="navbar-brand"
					style={{ width: "70px", height: "70px" }}
				/>
			</a>*/}

			<div className="d-flex gap-3">
				<Link to="/PropietarioIndex" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>
					Principal
				</Link>
				<Link to="/Contact" className="btn btn-light btn-sm w-100" style={{ minWidth: "120px" }}>
					Contacto
				</Link>
				<Link to="/Servicios" className="btn btn-light btn-sm w-100" style={{ minWidth: "150px" }}>
					Perfil de Usuario
				</Link>
				<Link to="/" className="btn btn-light btn-sm w-100 me-5" style={{ minWidth: "120px" }}>
					Salir
				</Link>
			</div>

		</nav>
	);
};


export default Navbar;

