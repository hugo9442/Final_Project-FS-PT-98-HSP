// Import necessary components from react-router-dom and other parts of the application.

import useGlobalReducer from "../hooks/useGlobalReducer";  
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInDays } from 'date-fns';
import { Asociations } from "../fetch_asociations.js";
import { contracts } from "../fecht_contract.js";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";


export const Demo = () => {
   const { theId } = useParams();
  
  const { store, dispatch } = useGlobalReducer()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {

      const data = await contracts.getAssocByApertmentId(parseInt(theId), store.token);
      console.log(data)
      await dispatch({ type: "addAssocByApertmentId", value: data });

    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [store.todos, store.token]);

  const handleDownloadContract = async (contractId) => {
    console.log(`Intentando descargar contrato con ID: ${contractId}`);
    try {
      const data = await contracts.downloadcontract(contractId, store.token);
      if (data && !data.error) {
        swal("Descarga iniciada", "Tu contrato debería empezar a descargarse.", "success");
      } else {
        swal("Error de descarga", data?.error || "No se pudo descargar el contrato.", "error");
      }
    } catch (error) {
      console.error("Error al descargar contrato:", error);
      swal("Error de conexión", "No se pudo conectar para descargar el contrato.", "error");
    }
  };


  const getDaysBadgeClass = (days) => {
    if (days < 0) { return 'bg-danger text-white' };
    if (days <= 30) { return 'bg-warning text-dark' };
    if (days <= 90) { return 'bg-info text-white' };
    return 'bg-success text-white';
  };

  const getDaysStatusText = (days) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
    if (days === 0) return `Vence hoy`;
    return `Faltan ${days} días`;
  };

 
   return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          

          <div className="col-md-9">
            <div className="p-4 border rounded bg-light">
              <h2 className="mb-3">Alquileres Activos</h2>
              </div>
              </div>
              </div>
        </div>
        </>
   )
};
