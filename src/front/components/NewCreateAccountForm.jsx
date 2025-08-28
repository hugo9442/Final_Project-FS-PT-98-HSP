import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgEdificio from "../assets/img/ImgEdificio.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import swal from "sweetalert";
import conforrent from "../assets/img/conforrent.png"

import GoogleAuth from "../components/Googlebotton.jsx";

const CreateaccountUser = ({ setShowRegister, onUserCreated, priceId }) => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/propietarioindex");

  const handleCreatUser = async () => {
    try {
      const data = await users.createuser(store.firstname, store.lastname, store.rol, store.email, store.password, store.phone, store.national_id, store.aacc);

      if ((typeof data.token === "string" && data.token.length > 0)) {
        await dispatch({ type: "addToken", value: data.token });
        await dispatch({ type: "add_user", value: data.user });
        setShowRegister(false);


        swal({
          title: "NUEVO USUARIO",
          text: "USUARIO CREADO CON EXITO",
          icon: "success",
          buttons: true,
        });


        // Llamamos al padre para continuar con Stripe
        if (onUserCreated) onUserCreated(data.user.id);
      }

      if (data.error === "El email ya está registrado") {
        swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
        return;
      }



    } catch (error) { }
  };

  const createContact = async () => {
    if (store.email !== "" && store.password !== "") {

      await handleCreatUser();

    }
  };


  return (
    <section
      style={{ backgroundColor: "#FFE8D5", minHeight: "90vh" }}
    >
      <div className="container py-4">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col col-md-10 col-lg-8">
            <div className="card shadow-sm" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-5 d-none d-md-block">
                  <img
                    src={ImgEdificio}
                    alt="registration form"
                    className="img-fluid object-fit-cover"
                    style={{ borderRadius: "1rem 0 0 1rem", height: "100%" }}
                  />
                </div>
                <div className="col-md-7 d-flex align-items-center">
                  <div className="card-body p-3 p-md-4 text-black">
                    <form onSubmit={(e) => { e.preventDefault(); createContact(); }}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img
                          src={conforrent}
                          alt="Logo"
                          style={{ width: "100px", height: "70px" }}
                        />
                        <span className="h5 fw-bold mb-0 ms-2">Gestion Immuebles</span>
                      </div>

                      <h6 className="fw-normal mb-3 pb-2" style={{ letterSpacing: "1px" }}>
                        Crea tu Cuenta de Propietario
                      </h6>

                      <div className="row">
                        <div className="col-6 mb-3">
                          <input
                            type="text"
                            id="firstName"
                            className="form-control form-control-sm"
                            onChange={(e) => dispatch({ type: "addFirtsname", value: e.target.value })}
                            value={store.firstname || ''}
                            placeholder="Nombre"
                          />
                        </div>
                        <div className="col-6 mb-3">
                          <input
                            type="text"
                            id="lastName"
                            className="form-control form-control-sm"
                            onChange={(e) => dispatch({ type: "addLastname", value: e.target.value })}
                            value={store.lastname || ''}
                            placeholder="Apellido"
                          />
                        </div>
                      </div>

                      <input
                        type="email"
                        id="registerEmail"
                        className="form-control form-control-sm mb-3"
                        autoComplete="new-password"
                        onChange={(e) => dispatch({ type: "addEmail", value: e.target.value })}
                        value={store.email || ''}
                        placeholder="Email"
                      />

                      <input
                        type="password"
                        id="registerPassword"
                        className="form-control form-control-sm mb-3"
                        autoComplete="new-password"
                        onChange={(e) => dispatch({ type: "addPassword", value: e.target.value })}
                        value={store.password || ''}
                        placeholder="Contraseña"
                      />
                      <select
                        type="rol"
                        id="registerrol"
                        className="form-control form-control-sm mb-3"
                        autoComplete="rol"
                        onChange={(e) => dispatch({ type: "addrol", value: e.target.value })}
                        value={store.rol || ''}
                        placeholder="Elije tu Rol"
                      >
                        <option value="">Elige tu Rol</option>
                        <option value="ADMIN">ADMINISTRADOR</option>
                        <option value="PROPIETARIO">PROPIETARIO</option>
                      </select>


                    </form>
                    <div className="d-flex flex-column gap-2 mb-3">
                      <button className="btn btn-orange btn-sm w-100 " type="submit">
                        Crear Cuenta
                      </button>
                      <GoogleAuth priceId={priceId} />
                      <button
                        className="btn btn-outline-orange btn-sm w-100"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowRegister(false);
                        }}
                      >
                        Cerrar
                      </button>
                    </div>

                    <div className="d-flex justify-content-start gap-2">
                      <a href="#!" className="small text-muted">Terms of use</a>
                      <a href="#!" className="small text-muted">Privacy policy</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )

}

export default CreateaccountUser;