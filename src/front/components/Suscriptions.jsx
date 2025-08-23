import React from "react";
import SubscribeButton from "../components/Stripebotton.jsx";


const plans = [
    {
        prod_Id: "price_1RxU2EI1ArEJhAgy11OkvFEi", // Añade el priceId correspondiente
        name: "Básico",
        price: "20€ / mes",
        trial: "30 días de prueba",
        features: [
            "Hasta 5 propiedades",
            "Gestión de contratos e incidencias",
            "Seguimiento de pagos",
            "Reportes básicos",
            "Notificaciones por email",
        ],
        gradient: "from-blue-400 to-blue-600",
    },
    {
        prod_Id: "price_1Ry7bRI1ArEJhAgyviCDaUw3",
        name: "Pro",
        price: "50€ / mes",
        trial: "30 días de prueba",
        features: [
            "Propiedades ilimitadas",
            "Gestión completa de contratos e incidencias",
            "Control avanzado de pagos y facturas",
            "Reportes avanzados de rentabilidad y gastos",
            "Integración con proveedores y documentos PDF",
            "Historial de inquilinos y reputación",
            "Soporte prioritario",
        ],
        gradient: "from-purple-400 to-purple-600",
    },
];

const Suscription = () => {


    return (
       <section id="planes" className="py-5 bg-light text-center">
      <div className="container">
        <h2 className="fw-bold mb-5">Elige tu plan</h2>
        <div className="contraitem row g-4 justify-content-center">
          {plans.map((plan, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card shadow-lg w-100">
                <div className="card-body d-flex flex-column text-center">
                  <h3 className="card-title">{plan.name}</h3>
                  <p className="fs-4 fw-bold">{plan.price}</p>
                  <p className="text-muted">{plan.trial}</p>
                  <ul className="list-unstyled text-start flex-grow-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="mb-2 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <SubscribeButton key={plan.name} priceId={plan.prod_Id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    );



}

export default Suscription;
