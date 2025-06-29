import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
//import { apartments } from "../fecht_apartment.js";
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { useState } from "react";
import { users } from "../fecht_user.js"

const NewTenantContractForm = ({ onSuccess, onCancel }) => {

    const { store, dispatch } = useGlobalReducer();
    const [isLoading, setIsLoading] = useState(false);
    const [renta, setRenta] = useState(0)

    const handleCreatenant = async () => {
        let createdTenantId = null;
        let createdContractId = null;

        try {
            // Paso 1: Crear inquilino
            const tenantResult = await users.sendTenantInvite(
                store.firstname,
                store.lastname,
                store.email,
                store.phone,
                store.national_id,
                store.aacc,
                store.token
            );

            if (tenantResult.error) throw new Error(tenantResult.error);
            createdTenantId = tenantResult.tenant.id;
            await dispatch({ type: "add_tenant", value: tenantResult.tenant });

            // Paso 2: Crear contrato
            const contractResult = await contracts.create_contract(
                store.contract_start_date,
                store.contract_end_date,
                store.contract,
                store.todos.id,
                store.token
            );

            if (contractResult.error) throw new Error(contractResult.error);
            createdContractId = contractResult.contract.id;
            await dispatch({ type: "add_contracts", value: contractResult.contract });

            // Paso 3: Crear asociación
            const asociationResult = await Asociations.createAsociation(
                createdTenantId,
                createdContractId,
                renta,
                store.token
            );

            if (asociationResult.error) throw new Error(asociationResult.error);

            const asociationload = await users.get_asociation(
                store.todos.id,
                store.token
            );

            if (asociationload.error) throw new Error(asociationload.error);

            await dispatch({ type: "add_asociation", value: asociationload });
            swal({ title: "ÉXITO", text: "Operaciones completadas", icon: "success" });
            onSuccess()
        } catch (error) {
            // 🔁 ROLLBACK
            if (createdContractId) {
                await contracts.delete_contract(createdContractId, store.token).catch(() => { });
            }
            if (createdTenantId) {
                await users.delete_tenant(createdTenantId, store.token).catch(() => { });
            }

            swal({ title: "ERROR", text: error.message, icon: "error" });
        }
    };



    const Ctenant = async () => {
        if (store.firstname === "" || store.lastname === "" || store.email === "" || store.phone === "" || store.national_id === "" || store.aacc === ""
            || store.contract_start_date === "" || store.contract_end_date === "" || store.contract === "") {
            swal({
                title: "ERROR",
                text: "No puede haber ningún campo vacio",
                icon: "warning",
                buttons: true,
            });
        } else {
            setIsLoading(true); // Activar spinner al iniciar la acción
            try {
                await handleCreatenant();
            } catch (error) {
                console.error("Error en Crent:", error);
            } finally {
                setIsLoading(false); // Desactivar spinner cuando termine (éxito o error)
            }

        }

    };

    return (
        <div className="form">
            <div className="row">
                <h5>Inquilino</h5>
                {isLoading && (
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando contratos...</p>
                    </div>
                )}

                <div className="col-md-6" style={{ textTransform: "capitalize" }}>
                    <input type="text" id="firsth" placeholder="Nombre" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addFirtsname", value: e.target.value, })} required />
                    <input type="text" id="lasth" placeholder="Apellidos" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addLastname", value: e.target.value, })} required />
                    <input type="text" id="nidh" placeholder="DNI/NIE/PASAPORTE" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addNid", value: e.target.value, })} required />
                </div>
                <div className="col-md-6">
                    <input type="email" id="emailh" placeholder="Email" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addEmail", value: e.target.value, })} required />
                    <input type="text" id="phoneh" placeholder="Teléfono" className="form-control mb-2 "
                        onChange={(e) => dispatch({ type: "addPhone", value: e.target.value, })} required />
                    <input type="text" id="aacch" placeholder="Número de Cuenta" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "Aaccadd", value: e.target.value })} required />
                </div>
            </div>
            <div className="form" >
                <h5>Contrato</h5>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="start_date" className="form-label">Fecha de inicio </label>
                            <input type="date" className="form-control" id="start_day"
                                onChange={(e) => dispatch({ type: "addstart_date", value: e.target.value })} required /> </div>
                        <div className="mb-3">
                            <label htmlFor="renta" className="form-label">Importe Mensual de Renta </label>
                            <input
                                type="number"
                                className="form-control"
                                id="renta"
                                step="0.01"
                                min="0"
                                value={renta || ''}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    setRenta(isNaN(value) ? '' : value.toFixed(2));
                                }}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        setRenta(parseFloat(e.target.value).toFixed(2));
                                    }
                                }}
                                required
                            /> </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="end_date" className="form-label"> Fecha de Fin </label>
                            <input type="date" className="form-control" id="end_day"
                                onChange={(e) => dispatch({ type: "addend_date", value: e.target.value })} required /> </div></div>
                    <div className="col-md-12">
                        <div className="mb-3">
                            <label htmlFor="pdfUpload" className="form-label">Sube tu contrato en PDF </label>
                            <input type="file" className="form-control" id="pdfUpload" accept="application/pdf"
                                onChange={(e) => dispatch({ type: "addcontract", value: e.target.files[0] })} required /></div ></div>


                </div>
            </div>
            <button className="btn" style={{
                  color: "black",
                  backgroundColor: 'rgba(138, 223, 251, 0.8)',
                  textDecoration: "strong",
                  marginRight: "20px"
                }} onClick={Ctenant}>
                Añadir Inqulino
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
    );

}

export default NewTenantContractForm;