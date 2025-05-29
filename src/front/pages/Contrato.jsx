import React from "react";
import { contracts } from "../fecht_contract.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Contrato = () => {
  const { store, dispatch } = useGlobalReducer();
     const handleCreatecontract = async () => {
       
          try {
            const data = await contracts.create_contract(store.contract_start_date,store.contract_end_date,store.contract,store.todos[0].id, store.token);
            console.log(data);
            console.log(data.error)
           if (data.message==="El contrato ha sido registrado satisfactoriamente") {
              swal({
                title: "CONTRATO",
                text: "El contrato ha sido registrado satisfactoriamente",
                icon: "success",
                buttons: true,
            });
          }
           else {
            swal({
              title: "ERROR",
              text: `${data.error}`,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            });
          }
    
          } catch (error) {
            console.log(error)
                return error
          }
        };
         const Ccontract = async()=>{
      await
      handleCreatecontract();
    };
    return (
        <>


            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Menú lateral */}
                    <MenuLateral setActiveOption={() => { }} />

                    {/* Contenido principal */}
                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Contratos</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar contratos activos.</p>
                             <div className="mb-3">
                <label htmlFor="start_day" className="form-label">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="start_day"
                   onChange={(e) =>
                  dispatch({ type: "addstart_date", value: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="start_day" className="form-label">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="end_day"
                   onChange={(e) =>
                  dispatch({ type: "addend_date", value: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="pdfUpload" className="form-label">
                  Sube tu contrato en PDF
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="pdfUpload"
                  accept="application/pdf"

                  onChange={(e)=>dispatch({type:"addcontract", value:e.target.files[0]})}
                />
              </div>
              <button  className="btn btn-success" onClick={Ccontract}>
                Guardar Contrato
              </button>
                           
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Contrato;
