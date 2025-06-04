  
  const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/users"

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
                    "content-Type": "application/json"
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
    createtenant: async (firstname, lastname, email, pass, phone, national_id, aacc, token) => {
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
            const request = await fetch(`${Url}/create/tenant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer  ${token}`
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
    getUserApartmentsCount: async (id, token) => {
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
    getUserApartments: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments`, {
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
    getUserApartmentsNotRented: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/apartments/notrented`, {
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
    get_asociation: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}/contracts/assoc`, {
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
    delete_tenant: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
                  method: "DELETE", 
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

    }