import React from "react";
import { users } from "../fecht_user.js";
import MenuLateral from "../components/MenuLateral";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Inquilinos = () => {

    const { store, dispatch } = useGlobalReducer();
    const handleCreatuser = async () => {
      try {
        const data = await users.createtenant(store.firstname,store.lastname,store.email,store.password,store.phone,store.national_id,store.aacc);
        console.log(data);
        console.log(data.error)
        if (data.msg){
             swal({
          title: `${data.msg}`,
          text: `${data.user}`,
          icon: "success",
          buttons: true,
          dangerMode: true,
        });
        }
    
       if (data.error==="El email ya está registrado"){
         swal({
          title: "ERROR",
          text: `${data.error}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }
      if (data.error==="Email o contraseña inválidos"){
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
          title: "ERROR",
          text: `${data.msg}`,
          icon: "warning",
          buttons: true,
          dangerMode: true,
        });
      }

      } catch (error) {}
    };
const Ctenant = async () => {
    if (store.email !== "" && store.password !== "") {
      await
      handleCreatuser();
  }
   }
    return (
        <>


            <div className="container-fluid mt-4">
                <div className="row">
                    {/* Menú lateral */}
                    <MenuLateral setActiveOption={() => { }} />

                    {/* Contenido principal */}
                    <div className="col-md-9">
                        <div className="p-4 border rounded bg-light">
                            <h2>Gestión de Inquilinos</h2>
                            <p>Aquí puedes visualizar, cargar o gestionar inquilinos activos.</p>
                           <div className="mb-3">
                <label htmlFor="first_name" className="form-label">
                  Nombre
                </label>
                <input
                            type="text"
                            id="first_name"
                            className="form-control"
                            value={store.lastname}
                            onChange={(e) =>
                              dispatch({
                                type: "addLastname",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
              <div className="mb-3">
                <label htmlFor="last_name" className="form-label">
                  Apellidos
                </label>
                 <input
                            type="email"
                            id="last_name"
                            className="form-control"
                            value={store.email}
                            onChange={(e) =>
                              dispatch({
                                type: "addEmail",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  Password
                </label>
                 <input
                            type="password"
                            id="Password"
                            className="form-control form-control-lg"
                            value={store.password}
                            onChange={(e) =>
                              dispatch({
                                type: "addPassword",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
               <div className="mb-3">
                <label htmlFor="parking_slot" className="form-label">
                  Phone
                </label>
                 <input
                            type="text"
                            id="phone"
                            className="form-control form-control-lg"
                            value={store.Phone}
                            onChange={(e) =>
                              dispatch({
                                type: "addPhone",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
              <div className="mb-3">
                <label htmlFor="is_rent" className="form-label">
                 DNI
                </label>
                 <input
                            type="text"
                            id="DNI"
                            className="form-control"
                            value={store.National_Id}
                            onChange={(e) =>
                              dispatch({
                                type: "addNid",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
              <div className="mb-3">
                <label htmlFor="is_rent" className="form-label">
                Cuenta Corriente
                </label>
                <input
                            type="text"
                            id="aacc"
                            className="form-control form-control-lg"
                            value={store.aacc}
                            onChange={(e) =>
                              dispatch({
                                type: "addAacc",
                                value: e.target.value,
                              })
                            }
                          />
              </div>
              <button  className="btn btn-success" onClick={Ctenant}>
                Añadir vivienda
              </button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Inquilinos;