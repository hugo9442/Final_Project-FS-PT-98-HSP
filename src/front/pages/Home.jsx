import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { users } from "../fecht_user.js";
import swal from "sweetalert";
import { Await, json, useNavigate } from "react-router-dom";
import storeReducer from "../store.js";
import { PrivateRoutes } from "./privateroute.jsx";
export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const history = useNavigate();
  const handleNavigate = () => history("/demo");

  const handleCreatuser = async () => {
    try {
      const data = await users.createuser(store.email, store.password);

      console.log(data);
    } catch (error) {}
  };

  const handleLogingUser = async () => {
    try {
      const data = await users.loginguser(store.email, store.password);
      console.log(data);
       if(data.token) {
        await
        dispatch({ type: "addToken", value: data.token });
        await
         dispatch({ type: "add_user", value: data.user });
       }   
        
       else {
        swal({
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
      return data
    } catch (error) {}
  };
 
  const handleprivate = async () => {
    console.log('store',store)
    try {
      const data = await users.privateareauser(store.token);
      if (data.confirmation) {
        dispatch({ type: "add_user", value: data.user });

        swal({
          title: "Ya estás en tu area PRIVADA",
          text: `${data.user.email}`,
          icon: "success",
          buttons: true,
          dangerMode: true,
        });
      } else {
        swal({
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
    } catch (error) {}
  };

  const createContact = async () => {
    if (store.email !== "" && store.password !== "") {
      await handleCreatuser();
    }
  };
  const logingUser = async () => {
    if (store.email !== "" && store.password !== "") {
      const dataLogin= await handleLogingUser();
      handleNavigate()
      //checkToken()
      
     
    // if (dataLogin.validToken) {
    //    await handleprivate();
    //  }
    }
   
  };

  console.log(store.todos)
  return (
    <div className="text-center mt-5">
      <h1 className="title">Wellcome</h1>
      <div className="log mt-5">
        <label className="form-label">Enter Email</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Email"
          value={store.email}
          onChange={(e) =>
            dispatch({ type: "addEmail", value: e.target.value })
          }
        />
        <label className="form-label">Enter Password</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Password"
          value={store.password}
          onChange={(e) =>
            dispatch({ type: "addPassword", value: e.target.value })
          }
        />
        <button
          type="button"
          id="formButton"
          className="btn btn-primary mt-5"
          onClick={createContact}
        >
          Register
        </button>
        <button
          type="button"
          id="formButton"
          className="btn btn-primary mt-5"
          onClick={logingUser}
        >
          Login
        </button>
      </div>
    </div>
  );
};
