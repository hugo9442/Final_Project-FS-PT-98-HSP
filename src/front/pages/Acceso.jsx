import React from "react";
import { useNavigate } from "react-router-dom";
import ImgEdificio from "../assets/img/ImgEdificio.jpg";

const LoginSection = () => {
    const navigate = useNavigate();
    return (
        <section className="vh-100" style={{ backgroundColor: "#ebf5fb" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: "1rem" }}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src={ImgEdificio}
                                        alt="login form"
                                        className="img-fluid"
                                        style={{ borderRadius: "1rem 0 0 1rem" }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <img src="src/front/assets/img/LogoTrabajoFinal.png" alt="Logo" className="Logo" style={{ width: "100px", height: "100px" }} />
                                                <span className="h1 fw-bold mb-0">Gestion Immuebles</span>
                                            </div>

                                            <h5
                                                className="fw-normal mb-3 pb-3"
                                                style={{ letterSpacing: "1px" }}
                                            >
                                                Accede a tu cuenta
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="form2Example17"
                                                    className="form-control form-control-lg"
                                                />
                                                <label className="form-label" htmlFor="form2Example17">
                                                    Email
                                                </label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example27"
                                                    className="form-control form-control-lg"
                                                />
                                                <label className="form-label" htmlFor="form2Example27">
                                                    Contraseña
                                                </label>
                                            </div>

                                            <div className="pt-1 mb-4">
                                                <button
                                                    className="btn btn-dark btn-lg btn-block"
                                                    type="button"
                                                >
                                                    Acceder
                                                </button>

                                                <button
                                                    className="btn btn-dark btn-lg btn-block"
                                                    style={{ margin: 5 }}
                                                    type="button"
                                                    onClick={() => navigate("/PropietarioIndex")}
                                                >
                                                    Prueba Propietario
                                                </button>
                                            </div>

                                            <a className="small text-muted" href="#!">
                                                Olvidaste tu contraseña?
                                            </a>
                                            <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                                                No tienes cuenta?{" "}
                                                <a href="/#!" style={{ color: "#393f81" }}>
                                                    Registrate aquí
                                                </a>
                                            </p>
                                            <a href="#!" className="small text-muted">
                                                Terms of use.
                                            </a>
                                            <a href="#!" className="small text-muted ms-2">
                                                Privacy policy
                                            </a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginSection;
