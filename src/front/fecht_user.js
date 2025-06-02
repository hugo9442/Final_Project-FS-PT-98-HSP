const Url = "https://animated-space-memory-rjrw4x4v9qwfx55j-3001.app.github.dev/users"

  export const users = {

    createuser: async (firstname, lastname, email, pass, phone, national_id, aacc) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`${phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"PROPIETARIO"
           
        };
        
        console.log(user)
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    createtenant: async (firstname, lastname, email, pass, phone, national_id, aacc) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone":`${phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"INQUILINO"
           
        };
        console.log(user)
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                
                body: JSON.stringify(user)
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

      loginguser: async (email, pass) => {
        let user = {
             "email": `${email}`, "password": `${pass}`
        };
        
        try {
            const request = await fetch(`${Url}/login`, {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const response = await request.json();
            
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    privateareauser: async (token) => {
        try {
            const request = await fetch(`${Url}/private`, {
                method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
               
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

     getUser: async (id) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
                method: "GET"
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUserContractsCount: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts/count`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUserContracts: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },

    getUserApartments: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments/count`, {
                  method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    
    forgotPassword: async (email) => {
        try {
            const request = await fetch(`${Url}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            });

            const response = await request.json();
            return { message: response.message, success: request.ok };

        } catch (error) {
            console.error("Error al solicitar restablecimiento:", error);
            return { message: "Error de conexión. Intenta más tarde.", success: false };
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const request = await fetch(`${Url}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const response = await request.json();

            return { message: response.message, success: request.ok };

        } catch (error) {
            console.error("Error al restablecer contraseña:", error);
            return { message: "Error de conexión. Intenta más tarde.", success: false };
        }
    },
};