import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import { useEffect, useState } from "react";

export const PrivateRoutes = () => {
  const { store } = useGlobalReducer();
  const [valid, setValid] = useState(null); 

  const checkToken = async () => {
    if (typeof store.token === "string" && store.token.length > 0) {
      try {
        const data = await users.privateareauser(store.token);
        setValid(data.msg);
      } catch (error) {
        setValid(false);
      }
    } else {
      setValid(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, [store.token]); 


  if (valid === null) {
    return null; 
  }

  return valid ? <Outlet /> : <Navigate to="/Acceso" />;
};