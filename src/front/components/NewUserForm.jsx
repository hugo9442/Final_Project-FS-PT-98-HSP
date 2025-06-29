import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";

const NewuserForm = ({ onSuccess, onCancel }) => {

    const { store, dispatch } = useGlobalReducer();

    const handleCreatUser = async () => {
        try {
            const data = await users.createuser(
                store.firstname,
                store.lastname,
                store.email,
                store.password,
                store.phone,
                store.national_id,
                store.aacc);

            if (data.msg) {
                dispatch({ type: "add_owner", value: data.user });
                dispatch({ type: "addFirtsname", value: "" });
                dispatch({ type: "addLastname", value: "" });
                dispatch({ type: "addEmail", value: "" });
                dispatch({ type: "addPassword", value: "" });
                dispatch({ type: "addPhone", value: "" })
                dispatch({ type: "addNid", value: "" })
                dispatch({ type: "Aaccadd", value: "" })
                onSuccess();
            }



            if (data.error === "El email ya está registrado") {
                swal({
                    title: "ERROR",
                    text: `${data.error}`,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                });

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
    }

    const createContact = async () => {
        if (store.email !== "" && store.password !== "") {
            await
                handleCreatUser();

        }
    };

    return (
        <>
            <form className="form mt-2" onSubmit={(e) => { e.preventDefault(); createContact(); }}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <input 
                            type="text"
                            id="firstName"
                            className="form-control form-control-lg mb-3" placeholder="Nombre"
                            onChange={(e) => dispatch({ type: "addFirtsname", value: e.target.value })}
                            value={store.firstname || ''} required
                        />
                        <input
                            type="text"
                            id="nationalId"
                            className="form-control form-control-lg mb-3" placeholder="DNI"
                            onChange={(e) => dispatch({ type: "addNid", value: e.target.value })}
                            value={store.national_id || ''} required
                        />
                        <input
                            type="email"
                            id="registerEmail"
                            className="form-control form-control-lg mb-3"
                            autoComplete="new-password" placeholder="Email"
                            onChange={(e) => dispatch({ type: "addEmail", value: e.target.value })}
                            value={store.email || ''} required
                        />
                        <input
                            type="text"
                            id="aacc"
                            className="form-control form-control-lg mb-3" placeholder="Número de Cuenta"
                            onChange={(e) => dispatch({ type: "Aaccadd", value: e.target.value })}
                            value={store.aacc || ''} required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            id="lastName"
                            className="form-control form-control-lg mb-3" placeholder="Apellido"
                            onChange={(e) => dispatch({ type: "addLastname", value: e.target.value })}
                            value={store.lastname || ''} required
                        />
                       
                        <input
                            type="text"
                            id="phone"
                            className="form-control form-control-lg mb-3" placeholder="Teléfono"
                            onChange={(e) => dispatch({ type: "addPhone", value: e.target.value })}
                            value={store.phone || ''} required
                        />
                        <input
                            type="password"
                            id="registerPassword"
                            className="form-control form-control-lg mb-3"
                            autoComplete="new-password" placeholder="Contraseña"
                            onChange={(e) => dispatch({ type: "addPassword", value: e.target.value })}
                            value={store.password || ''} required
                        />
                    </div>
                </div>
            <div className="pt-1 mb-4">
                <button
                    className="btn btn-success me-2"
                    type="submit"
                >
                    Crear Propietario
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ margin: 5 }}
                    type="button"
                    onClick={onCancel}
                >
                    Cancelar
                </button>
            </div>
        </form >
        </>
    );
}
export default NewuserForm