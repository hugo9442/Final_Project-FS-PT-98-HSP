import React, { useState } from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Inquilinos = () => {

    const { store, dispatch } = useGlobalReducer();
    const [tenantFirstName, setTenantFirstName] = useState("");
    const [tenantLastName, setTenantLastName] = useState("");
    const [tenantEmail, setTenantEmail] = useState("");
    const [tenantPhone, setTenantPhone] = useState("");
    const [tenantNationalId, setTenantNationalId] = useState("");
    const [tenantAacc, setTenantAacc] = useState("");

    const handleSendTenantInvite = async () => {
        if (!tenantEmail || !tenantFirstName) {
            swal({
                title: "Advertencia",
                text: "Nombre y Email del inquilino son obligatorios.",
                icon: "info",
                buttons: true,
            });
            return;
        }

        const tenantData = {
            first_name: tenantFirstName,
            last_name: tenantLastName,
            email: tenantEmail,
            phone: tenantPhone,
            national_id: tenantNationalId,
            account_number: tenantAacc,
        };

        try {
            if (!store.token) {
                swal({ title: "Error", text: "No autorizado. Inicia sesión como propietario.", icon: "error" });
                return;
            }

            const result = await users.sendTenantInvite(tenantData, store.token);

            if (result.success) {
                swal({
                    title: "Inquilino Registrado",
                    text: result.message,
                    icon: "success",
                    buttons: true,
                }).then(() => {
                    setTenantFirstName("");
                    setTenantLastName("");
                    setTenantEmail("");
                    setTenantPhone("");
                    setTenantNationalId("");
                    setTenantAacc("");
                });
            } else {
                swal({
                    title: "Error",
                    text: result.message,
                    icon: "error",
                    buttons: true,
                    dangerMode: true,
                });
            }
        } catch (error) {
            console.error("Error en handleSendTenantInvite:", error);
            swal({
                title: "ERROR",
                text: "Ha ocurrido un error inesperado al registrar el inquilino. Intenta más tarde.",
                icon: "error",
                buttons: true,
                dangerMode: true,
            });
        }
    };

    const Ctenant = async () => {
        await handleSendTenantInvite();
    };
    return (
        <>
            <div className="container-fluid mt-4">
                <div className="row">
                    <MenuLateral setActiveOption={() => { }} />

                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Inquilinos</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar inquilinos activos.</p>
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">Nombre</label>
                                <input type="text" id="first_name" className="form-control"
                                    value={tenantFirstName} onChange={(e) => setTenantFirstName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Apellidos</label>
                                <input type="text" id="last_name" className="form-control"
                                    value={tenantLastName} onChange={(e) => setTenantLastName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tenant_email" className="form-label">Email</label> {/* Changed ID to avoid conflict */}
                                <input type="email" id="tenant_email" className="form-control"
                                    value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tenant_phone" className="form-label">Phone</label>
                                <input type="text" id="tenant_phone" className="form-control"
                                    value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tenant_dni" className="form-label">DNI</label>
                                <input type="text" id="tenant_dni" className="form-control"
                                    value={tenantNationalId} onChange={(e) => setTenantNationalId(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tenant_aacc" className="form-label">Cuenta Corriente</label>
                                <input type="text" id="tenant_aacc" className="form-control"
                                    value={tenantAacc} onChange={(e) => setTenantAacc(e.target.value)} />
                            </div>
                            <button className="btn btn-success" onClick={Ctenant}>Añadir inquilino</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inquilinos;