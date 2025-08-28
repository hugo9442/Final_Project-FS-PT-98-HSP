// src/front/components/GoogleAuth.jsx
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Urlexport } from "../urls";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const GoogleAuth = ({ priceId }) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const handleLogin = async (credentialResponse) => {
    if (!role) {
      alert("Por favor selecciona un rol antes de continuar.");
      return;
    }

    try {
      const res = await axios.post(`${Urlexport}/auth/login/google`, {

        token: credentialResponse.credential,
        role,
      });

      const { token, user, created } = res.data;

      dispatch({ type: "addToken", value: token });
      dispatch({ type: "add_user", value: user });
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Bienvenido ${user.first_name}, rol: ${user.role}`);

      console.log("created", created)


      if (created) {
        continueWithStripe(user.id);
        navigate("/propietarioindex")
      } else {
        navigate("/propietarioindex")
      }

      // Navegar solo si quieres

    } catch (error) {
      console.error("Error en login:", error.response.data);

      swal({
        title: "ERROR",
        text: `${error.response.data.error}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
    }
  };
  const continueWithStripe = async (newUserId) => {
    try {
      const res = await axios.post(`${Urlexport}/subscriptions/create-subscription`, {
        priceId,
        user_id: newUserId,
      });

      const { checkoutUrl } = res.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No se recibió checkoutUrl desde el servidor");
      }
    } catch (error) {
      console.error("Error creando la sesión de Stripe:", error.response?.data || error.message);
    }
  };

  console.log(store)
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div >
        <button
          type="button"
          className="btn btn-orange btn-sm btn-block w-100 "
          onClick={() => setShowModal(true)}
        >
          Continuar con Google
        </button>

        {/* Modal Bootstrap */}
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          aria-hidden={!showModal}>

          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecciona tu rol</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body d-flex flex-column gap-2">
                {["ADMIN", "PROPIETARIO"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`btn ${role === r ? "btn-primary" : "btn-outline-primary"
                      }`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}

                {role && (
                  <div className="mt-3 text-center">
                    <GoogleLogin

                      onSuccess={handleLogin}
                      onError={() => console.log("Login fallido")}
                      useOneTap={false}   // evita intentos automáticos de redirección
                      auto_select={false} // evita que Google elija cuenta sin preguntar
                    />

                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fondo oscuro modal */}
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
