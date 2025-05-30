  
  const Url = "https://refactored-computing-machine-69r94jvv6p6jhg6x-3001.app.github.dev/users"

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

    }