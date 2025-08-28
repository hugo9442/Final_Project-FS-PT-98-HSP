import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Urlexport } from "../urls";
import React, { useEffect, useState } from "react";
import CreateaccountUser from "./NewCreateAccountForm";
import ReactDOM from "react-dom";



const stripePromise = loadStripe("pk_test_51RxQx6I1ArEJhAgyE8i7jyHI6lQj8zL1SKJLYZ02GIOKj6DQCb73zb4TbKviVc7gSG65bnp8l3fGPB0JMZxXh72E00hnXEWozD");

const SubscribeButton = ({ priceId, user }) => {
  const [showRegister, setShowRegister] = useState(false);



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

  const handleClick = () => {
    if (!user || !user.id) {
      setShowRegister(true); // abre modal
      return;
    }
    continueWithStripe(user.id); // si ya hay user, vamos directo a Stripe
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="btn btn-orange px-4 py-2 text-white rounded"
      >
        Suscribirse
      </button>

      {/* Modal */}
      {showRegister &&
        ReactDOM.createPortal(
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
            role="dialog"
            onClick={() => setShowRegister(false)}
          >
            <div
              className="modal-dialog modal-fullscreen modal-dialog-centered "
              role="document"
              style={{ maxWidth: "800px", margin: "1.5rem auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Cuenta</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRegister(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <CreateaccountUser setShowRegister={setShowRegister}
                    onUserCreated={continueWithStripe}
                    priceId={priceId} />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SubscribeButton;