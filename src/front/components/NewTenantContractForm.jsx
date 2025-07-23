import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js"
import { taxholding } from "../fecht_taxholding.js";
import { tax } from "../fecht_tax.js";

const NewTenantContractForm = ({ onSuccess, onCancel }) => {

    const { store, dispatch } = useGlobalReducer();
    const [isLoading, setIsLoading] = useState(false);
    const [renta, setRenta] = useState(0);

    // NUEVO: estados para tax y withholding
    const [taxTypeId, setTaxTypeId] = useState(null);
    const [withholdingId, setWithholdingId] = useState(null);

    // Simulación de listas (en producción haces un fetch)
    const [taxTypes, setTaxTypes] = useState([]);
    const [withholdings, setWithholdings] = useState([]);

    const fetchData = async () => {

        try {

            const data = await tax.gettaxt(store.token);

            setTaxTypes(data)

        } catch (error) {
        }

        try {

            const data = await taxholding.getholding(store.token);

            setWithholdings(data)
        } catch (error) {
        }

    };

    useEffect(() => {
        fetchData();
    }, [store.token]);



    const handleCreatenant = async () => {
        let createdTenantId = null;
        let createdContractId = null;

        try {
            // 1. Crear inquilino
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
            dispatch({ type: "add_tenant", value: tenantResult.tenant });

            // 2. Crear contrato
            const contractResult = await contracts.create_contract(
                store.contract_start_date,
                store.contract_end_date,
                store.contract,
                store.todos.id,
                store.token
            );
            if (contractResult.error) throw new Error(contractResult.error);
            createdContractId = contractResult.contract.id;
            dispatch({ type: "add_contracts", value: contractResult.contract });

            // 3. Crear asociación con renta + fiscalidad
            const asociationResult = await Asociations.createAsociation(
                createdTenantId,
                createdContractId,
                renta,
                taxTypeId,
                withholdingId,
                store.token
            );
            if (asociationResult.error) throw new Error(asociationResult.error);

            const asociationload = await users.get_asociation(store.todos.id, store.token);
            if (asociationload.error) throw new Error(asociationload.error);

            swal({ title: "ÉXITO", text: "Operaciones completadas", icon: "success" });
            dispatch({ type: "add_asociation", value: asociationload });
            onSuccess();

        } catch (error) {
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
        if (!store.firstname || !store.lastname || !store.email || !store.phone || !store.national_id || !store.aacc ||
            !store.contract_start_date || !store.contract_end_date || !store.contract || !renta ||
            !taxTypeId || !withholdingId) {
            swal({
                title: "ERROR",
                text: "No puede haber ningún campo vacío, incluyendo impuestos",
                icon: "warning",
                buttons: true,
            });
        } else {
            setIsLoading(true);
            try {
                await handleCreatenant();
            } catch (error) {
                console.error("Error en Crent:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="form">
            <div className="row">
                <h5>Inquilino</h5>
                {isLoading && (
                    <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-3">Cargando contratos...</p>
                    </div>
                )}
                <div className="col-md-6" style={{ textTransform: "capitalize" }}>
                    <input type="text" placeholder="Nombre" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addFirtsname", value: e.target.value })} />
                    <input type="text" placeholder="Apellidos" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addLastname", value: e.target.value })} />
                    <input type="text" placeholder="DNI/NIE/PASAPORTE" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addNid", value: e.target.value })} />
                </div>
                <div className="col-md-6">
                    <input type="email" placeholder="Email" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addEmail", value: e.target.value })} />
                    <input type="text" placeholder="Teléfono" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "addPhone", value: e.target.value })} />
                    <input type="text" placeholder="Número de Cuenta" className="form-control mb-2"
                        onChange={(e) => dispatch({ type: "Aaccadd", value: e.target.value })} />
                </div>
            </div>

            <div className="form">
                <h5>Contrato</h5>
                <div className="row">
                    <div className="col-md-6">
                        <label>Fecha inicio</label>
                        <input type="date" className="form-control mb-2"
                            onChange={(e) => dispatch({ type: "addstart_date", value: e.target.value })} />
                        <label>Renta mensual</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            className="form-control mb-2"
                            value={renta}
                            onChange={(e) => {
                                const raw = e.target.value.replace(',', '.');
                                // permite vacío o número válido
                                if (/^\d*\.?\d{0,2}$/.test(raw) || raw === '') {
                                    setRenta(raw);
                                }
                            }}
                            onBlur={(e) => {
                                const raw = e.target.value.replace(',', '.');
                                const value = parseFloat(raw);
                                if (!isNaN(value)) {
                                    setRenta(value.toFixed(2));
                                }
                            }}
                        />
                        <label>Tipo IVA</label>
                        <select className="form-select mb-2" value={taxTypeId || ''} onChange={(e) => setTaxTypeId(parseInt(e.target.value))}>
                            <option value="">Selecciona IVA</option>
                            {taxTypes.map((t) => (
                                <option key={t.id} value={t.id}>{t.name} ({t.percentage}%)</option>
                            ))}
                        </select>

                        <label>Retención IRPF</label>
                        <select className="form-select mb-2" value={withholdingId || ''} onChange={(e) => setWithholdingId(parseInt(e.target.value))}>
                            <option value="">Selecciona Retención</option>
                            {withholdings.map((w) => (
                                <option key={w.id} value={w.id}>{w.name} ({w.percentage}%)</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label>Fecha fin</label>
                        <input type="date" className="form-control mb-2"
                            onChange={(e) => dispatch({ type: "addend_date", value: e.target.value })} />
                        <label>Contrato PDF</label>
                        <input type="file" accept="application/pdf" className="form-control mb-2"
                            onChange={(e) => dispatch({ type: "addcontract", value: e.target.files[0] })} />
                    </div>
                </div>
            </div>

            <button className="btn" style={{
                color: "black", backgroundColor: 'rgba(138, 223, 251, 0.8)', marginRight: "20px"
            }} onClick={Ctenant}>
                Añadir Inquilino
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
    );
}

export default NewTenantContractForm;
