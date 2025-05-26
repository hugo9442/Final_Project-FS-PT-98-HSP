import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const PrivateRoutes = () => {
  const {store} = useGlobalReducer()

 const checkToken = async () => {
  if ((typeof store.token === "string" && store.token.length > 0)){
     console.log('store',store)
     
    try {
      const data = await users.privateareauser(store.token);
      return data
    } catch (error) {}
  };

  
  }
  const valid=checkToken()
  console.log(valid)
  return (valid ? <Outlet/> : <Navigate to="/" />
  )
  
}