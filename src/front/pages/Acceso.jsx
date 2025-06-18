import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgEdificio from "../assets/img/ImgEdificio.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import swal from "sweetalert";

const LoginSection = () => {

  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/propietarioindex");

  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [messageFeedback, setMessageFeedback] = useState(null);

  const [tenantSetPassword, setTenantSetPassword] = useState("");
  const [confirmTenantSetPassword, setConfirmTenantSetPassword] = useState("");


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");

    setMessageFeedback(null);

    if (urlToken) {
      dispatch({ type: "setResetToken", value: urlToken });

      if (location.pathname === "/set-password") {
        dispatch({ type: "showTenantSetPassword" });
      } else if (location.pathname === "/reset-password") {
        dispatch({ type: "showResetPassword" });
      } else {
        dispatch({ type: "login", value: "block" });
        setMessageFeedback("Enlace de acceso inválido o expirado.");
      }
    } else {
      dispatch({ type: "setResetToken", value: null });
      if (store.visibility === "none" &&
        store.forgotPasswordVisibility === "none" &&
        store.resetPasswordVisibility === "none" &&
        store.tenantSetPasswordVisibility === "none" &&
        store.visibility2 === "none") {
        dispatch({ type: "login", value: "block" });
      }
    }
  }, [location.pathname, location.search, dispatch, store.visibility, store.forgotPasswordVisibility, store.resetPasswordVisibility, store.tenantSetPasswordVisibility, store.visibility2]);

  const handleCreatUser = async () => {
    try {
      const data = await users.createuser(store.firstname, store.lastname, store.email, store.password, store.phone, store.national_id, store.aacc);
     
      if ((typeof data.token === "string" && data.token.length > 0)) {
        await dispatch({ type: "addToken", value: data.token });
        await dispatch({ type: "add_user", value: data.user });
         handleNavigate()  
      }
              
      if (data.error === "El email ya está registrado") {
        swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
        if(store.todos.role==="inquilino"){

        }
      }
      if (data.error) {
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
          title: "USUARIO CREADO",
          text: `${data.msg}`,
          icon: "success",
          buttons: true,
        });
      }

    } catch (error) { }
  };
  const handleLogingUser = async () => {
    try {
      const data = await users.loginguser(store.email, store.password);
      console.log(data);

      if ((typeof data.token === "string" && data.token.length > 0)) {
        await dispatch({ type: "addToken", value: data.token });
        await dispatch({ type: "add_user", value: data.user }); 
      } if (data.user.role==="PROPIETARIO"){
        handleNavigate() 
      }if(data.user.role==="INQUILINO"){
        navigate("/InquilinoIndex")
      }else if (data.msg === "El mail o la contraseña es incorrecto") {
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
          title: "EXITO",
          text: "LOGEADO CON EXITO",
          icon: "success",
          buttons: true,
        });
      }
      return data;
    } catch (error) { }
  };

  const createContact = async () => {
    if (store.email !== "" && store.password !== "") {
      await
        handleCreatUser();

      // handleNavigate();
    }
  };

  const logingUser = async () => {
    if (store.email !== "" && store.password !== "") {
      await handleLogingUser();

    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessageFeedback(null);

    if (!forgotEmail) {
      setMessageFeedback("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const result = await users.forgotPassword(forgotEmail);

    if (result.message) {
      swal({
        title: "Correo enviado",
        text: result.message,
        icon: "success",
        buttons: true,
      });
    } else {
      swal({
        title: "Error",
        text: result.error,
        icon: "error",
        buttons: true,
      });
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessageFeedback(null);

    if (!store.resetToken) {
      setMessageFeedback("Token de restablecimiento no encontrado.");
      return;
    }

    if (newPassword.length < 8) {
      setMessageFeedback("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessageFeedback("Las contraseñas no coinciden.");
      return;
    }

    const result = await users.resetPassword(store.resetToken, newPassword);

    if (result.success) {
      swal({
        title: "Contraseña restablecida",
        text: result.message,
        icon: "success",
        buttons: false,
        timer: 2500,
      }).then(() => {
        setTimeout(() => {
          navigate("/Acceso");
        }, 500);
      });
      setMessageFeedback(result.message);
    } else {
      swal({
        title: "Error",
        text: result.message,
        icon: "error",
        buttons: true,
      });
    }
  };

  const handleTenantSetPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessageFeedback(null);

    if (!store.resetToken) {
      setMessageFeedback("Token inválido o no encontrado. Por favor, utiliza el enlace de tu correo electrónico.");
      return;
    }

    if (tenantSetPassword.length < 8) {
      setMessageFeedback("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (tenantSetPassword !== confirmTenantSetPassword) {
      setMessageFeedback("Las contraseñas no coinciden.");
      return;
    }

    try {
      const result = await users.setTenantInitialPassword(store.resetToken, tenantSetPassword);

      if (result.success) {
        swal({
          title: "Contraseña Configurada",
          text: result.message,
          icon: "success",
          buttons: false,
          timer: 2500,
        }).then(() => {
          setTimeout(() => {
            dispatch({ type: "login", value: "block" });
            navigate("/acceso");
          }, 500);
        });
      } else {
        swal({
          title: "Error",
          text: result.message,
          icon: "error",
          buttons: true,
        });
      }
    } catch (error) {
      console.error("Error al configurar la contraseña del inquilino:", error);
      swal({
        title: "Error",
        text: "Error de conexión al configurar la contraseña.",
        icon: "error",
        buttons: true,
      });
    }
  };


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
                            id="email"
                            className="form-control form-control-lg"
                            autoComplete="username"
                            onChange={(e) => dispatch({ type: "addEmail", value: e.target.value })}
                            value={store.email || ''}
                          />
                          <label className="form-label" htmlFor="email">Email</label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="pass"
                            autoComplete="current-password"
                            className="form-control form-control-lg"
                            onChange={(e) => dispatch({ type: "addPassword", value: e.target.value })}
                            value={store.password || ''}
                          />
                          <label className="form-label" htmlFor="pass">Contraseña</label>
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
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch({ type: "register", value: "block" });
                            }}
                          >
                            Crear Cuenta
                          </button>
                        </div>

                        <a
                          className="small text-muted"
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: "showForgotPassword" });
                          }}
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                        <div>
                          <a href="#!" className="small text-muted">
                            Terms of use
                          </a>
                          <a href="#!" className="small text-muted ms-2">
                            Privacy policy
                          </a>
                        </div>
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
        style={{ backgroundColor: "#ebf5fb", display: `${store.visibility}` }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={ImgEdificio}
                      alt="registration form"
                      className="img-fluid h-100 object-fit-cover"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={(e) => { e.preventDefault(); createContact(); }}>
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
                          Crea tu Cuenta de Propietario
                        </h5>

                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="firstName"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch({ type: "addFirtsname", value: e.target.value })}
                                value={store.firstname || ''}
                              />
                              <label className="form-label" htmlFor="firstName">Nombre</label>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="lastName"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch({ type: "addLastname", value: e.target.value })}
                                value={store.lastname || ''}
                              />
                              <label className="form-label" htmlFor="lastName">Apellido</label>
                            </div>
                          </div>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="registerEmail"
                            className="form-control form-control-lg"
                            autoComplete="new-password"
                            onChange={(e) => dispatch({ type: "addEmail", value: e.target.value })}
                            value={store.email || ''}
                          />
                          <label className="form-label" htmlFor="registerEmail">Email</label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="registerPassword"
                            className="form-control form-control-lg"
                            autoComplete="new-password"
                            onChange={(e) => dispatch({ type: "addPassword", value: e.target.value })}
                            value={store.password || ''}
                          />
                          <label className="form-label" htmlFor="registerPassword">Contraseña</label>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="phone"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch({ type: "addPhone", value: e.target.value })}
                                value={store.phone || ''}
                              />
                              <label className="form-label" htmlFor="phone">Teléfono</label>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="nationalId"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch({ type: "addNid", value: e.target.value })}
                                value={store.national_id || ''}
                              />
                              <label className="form-label" htmlFor="nationalId">DNI</label>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <input
                                type="text"
                                id="aacc"
                                className="form-control form-control-lg"
                                onChange={(e) => dispatch({ type: "Aaccadd", value: e.target.value })}
                                value={store.aacc || ''}
                              />
                              <label className="form-label" htmlFor="nationalId">Número de Cuenta</label>
                            </div>
                          </div>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Crear Cuenta
                          </button>
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            style={{ margin: 5 }}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch({ type: "login", value: "block" });
                            }}
                          >
                            Volver a login
                          </button>
                        </div>
                        <a href="#!" className="small text-muted">
                          Terms of use
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
        style={{ backgroundColor: "#ebf5fb", display: `${store.forgotPasswordVisibility}` }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={ImgEdificio}
                      alt="forgot password form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        ¿Olvidaste tu contraseña?
                      </h5>
                      <p className="text-muted mb-4">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
                      </p>
                      <form onSubmit={handleForgotPasswordSubmit}>
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="forgotEmail"
                            className="form-control form-control-lg"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          // required
                          />
                          <label
                            className="form-label"
                            htmlFor="forgotEmail"
                          >
                            Correo Electrónico
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Enviar enlace
                          </button>
                        </div>
                        {store.resetMessage && (
                          <div className={`alert ${store.resetMessage.includes("Error") || store.resetMessage.includes("conect") ? "alert-danger" : "alert-info"}`} role="alert">
                            {store.resetMessage}
                          </div>
                        )}
                        <a
                          href="#!"
                          className="small text-muted"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch({ type: "login", value: "block" });
                          }}
                        >
                          Volver al inicio de sesión
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
        style={{ backgroundColor: "#ebf5fb", display: `${store.resetPasswordVisibility}` }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={ImgEdificio}
                      alt="reset password form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Restablecer Contraseña
                      </h5>
                      {store.resetToken === null && (
                        <p className="text-center text-danger">
                          No se encontró un token válido. Por favor, utiliza el enlace de tu correo electrónico.
                        </p>
                      )}
                      {store.resetMessage && (
                        <div className={`alert ${store.resetMessage.includes("éxito") ? "alert-success" : "alert-danger"}`} role="alert">
                          {store.resetMessage}
                        </div>
                      )}

                      {store.resetToken && (
                        <form onSubmit={handleResetPasswordSubmit}>
                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="newPassword"
                              className="form-control form-control-lg"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              minLength="8"
                            />
                            <label
                              className="form-label"
                              htmlFor="newPassword"
                            >
                              Nueva Contraseña
                            </label>
                          </div>
                          <div className="form-outline mb-4">
                            <input
                              type="password"
                              id="confirmNewPassword"
                              className="form-control form-control-lg"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              required
                              minLength="8"
                            />
                            <label
                              className="form-label"
                              htmlFor="confirmNewPassword"
                            >
                              Confirmar Contraseña
                            </label>
                          </div>
                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                            >
                              Guardar Nueva Contraseña
                            </button>
                          </div>
                        </form>
                      )}
                      <a
                        href="#!"
                        className="small text-muted"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch({ type: "login", value: "block" });
                          navigate("/Acceso");
                        }}
                      >
                        Volver al inicio de sesión
                      </a>
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
        style={{ backgroundColor: "#ebf5fb", display: `${store.tenantSetPasswordVisibility}` }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img src={ImgEdificio} alt="set password form" className="img-fluid" style={{ borderRadius: "1rem 0 0 1rem" }} />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Configura tu Contraseña</h5>
                      {store.resetToken === null && (
                        <p className="text-center text-danger">Token inválido o no encontrado. Por favor, utiliza el enlace de tu correo electrónico.</p>
                      )}
                      {messageFeedback && (
                        <div className={`alert ${messageFeedback.includes("éxito") ? "alert-success" : "alert-danger"}`} role="alert">
                          {messageFeedback}
                        </div>
                      )}

                      {store.resetToken && (
                        <form onSubmit={handleTenantSetPasswordSubmit}>
                          <div className="form-outline mb-4">
                            <input type="password" id="tenantSetPassword" className="form-control form-control-lg"
                              value={tenantSetPassword} onChange={(e) => setTenantSetPassword(e.target.value)} required minLength="8" />
                            <label className="form-label" htmlFor="tenantSetPassword">Nueva Contraseña</label>
                          </div>
                          <div className="form-outline mb-4">
                            <input type="password" id="confirmTenantSetPassword" className="form-control form-control-lg"
                              value={confirmTenantSetPassword} onChange={(e) => setConfirmTenantSetPassword(e.target.value)} required minLength="8" />
                            <label className="form-label" htmlFor="confirmTenantSetPassword">Confirmar Contraseña</label>
                          </div>
                          <div className="pt-1 mb-4">
                            <button className="btn btn-dark btn-lg btn-block" type="submit">Guardar Contraseña</button>
                          </div>
                        </form>
                      )}
                      <a href="#!" className="small text-muted" onClick={(e) => { e.preventDefault(); dispatch({ type: "login", value: "block" }); navigate("/Acceso"); }}>Volver al inicio de sesión</a>
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
