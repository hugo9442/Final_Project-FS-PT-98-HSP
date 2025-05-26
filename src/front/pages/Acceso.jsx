import React from "react";
import { useNavigate } from "react-router-dom";
import ImgEdificio from "../assets/img/ImgEdificio.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import swal from "sweetalert";

const LoginSection = () => {
  const { store, dispatch } = useGlobalReducer();
  const history = useNavigate();
  const handleNavigate = () => history("/propietarioindex");
  const navigate = useNavigate();


  const handleCreatuser = async () => {
      try {
        const data = await users.createuser(store.firstname,store.lastname,store.email,store.password,store.phone,store.national_id,store.aacc);
        console.log(data);
        console.log(data.error)
       if ((typeof data.token === "string" && data.token.length > 0)) {
        await dispatch({ type: "addToken", value: data.token });
        await dispatch({ type: "add_user", value: data.user });
        handleNavigate()
      }
       if (data.error==="El email ya está registrado"){
         swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
      if (data.error==="Email o contraseña inválidos"){
        swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
       else {
        swal({
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }

      } catch (error) {}
    };
  const handleLogingUser = async () => {
    try {
      const data = await users.loginguser(store.email, store.password);
      console.log(data);

      if ((typeof data.token === "string" && data.token.length > 0)) {
        await dispatch({ type: "addToken", value: data.token });
        await dispatch({ type: "add_user", value: data.user });
        handleNavigate()
      }else if (data.msg==="El mail o la contraseña es incorrecto"){
         swal({
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
       else {
        swal({
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
      return data;
    } catch (error) {}
  };
  const createContact = async () => {
    if (store.email !== "" && store.password !== "") {
      await
      handleCreatuser();
      
     // handleNavigate();
    }
  };
  const logingUser = async () => {
    if (store.email !== "" && store.password !== "") {
       await handleLogingUser();
      //handleNavigate();
      //checkToken()

      // if (dataLogin.validToken) {
      //    await handleprivate();
      //  }
    }
  };
 console.log(store)
  return (
    <div>
      <section
        className="vh-100"
        style={{ backgroundColor: "#ebf5fb", display: `${store.visibility2}` }}
      >
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
                          <img
                            src="src/front/assets/img/LogoTrabajoFinal.png"
                            alt="Logo"
                            className="Logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                          <span className="h1 fw-bold mb-0">
                            Gestion Immuebles
                          </span>
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
                            value={store.email}
                            onChange={(e) =>
                              dispatch({
                                type: "addEmail",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example17"
                          >
                            Email
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            value={store.password}
                            onChange={(e) =>
                              dispatch({
                                type: "addPassword",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example27"
                          >
                            Contraseña
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                            onClick={logingUser}
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
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          No tienes cuenta?{" "}
                          <a
                            href="#!"
                            style={{ color: "#393f81" }}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch({
                                type: "register",
                                value: "none",
                              })
                              dispatch({
                                type: "login",
                                value: "",
                              })
                            }}
                          >
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

      <section
        className="vh-100"
        style={{ backgroundColor: "#ebf5fb", display:`${store.visibility}` }}
      >
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
                          <img
                            src="src/front/assets/img/LogoTrabajoFinal.png"
                            alt="Logo"
                            className="Logo"
                            style={{ width: "100px", height: "100px" }}
                          />
                          <span className="h1 fw-bold mb-0">
                            Gestion Immuebles
                          </span>
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Accede a tu cuenta
                        </h5>

                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example1"
                            className="form-control form-control-lg"
                            value={store.firstname}
                            onChange={(e) =>
                              dispatch({
                                type: "addFirtsname",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example1"
                          >
                            "First name"
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example2"
                            className="form-control form-control-lg"
                            value={store.lastname}
                            onChange={(e) =>
                              dispatch({
                                type: "addLastname",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example2"
                          >
                            "Last name"
                          </label>
                        </div>
                                                     
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form2Example3"
                            className="form-control form-control-lg"
                            value={store.email}
                            onChange={(e) =>
                              dispatch({
                                type: "addEmail",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example3"
                          >
                            Email
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example4"
                            className="form-control form-control-lg"
                            value={store.password}
                            onChange={(e) =>
                              dispatch({
                                type: "addPassword",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example4"
                          >
                            Contraseña
                          </label>
                        </div>
                        
                             <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example5"
                            className="form-control form-control-lg"
                            value={store.Phone}
                            onChange={(e) =>
                              dispatch({
                                type: "addPhone",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example5"
                          >
                            Telefono
                          </label>
                        </div>
                        
                              <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example6"
                            className="form-control form-control-lg"
                            value={store.National_Id}
                            onChange={(e) =>
                              dispatch({
                                type: "addNid",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example6"
                          >
                            "DNI"
                          </label>
                        </div>
                         <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example7"
                            className="form-control form-control-lg"
                            value={store.aacc}
                            onChange={(e) =>
                              dispatch({
                                type: "addAacc",
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example7"
                          >
                            "Account Number"
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                            onClick={createContact}
                          >
                            Crear Cuenta
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
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "red" }}
                        >
                         
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
    </div>
  );
};

export default LoginSection;
