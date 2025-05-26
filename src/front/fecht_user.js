  
  const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/user"

  export const users = {

    createuser: async (firstname, lastname, email, pass, phone, national_id, aacc) => {
        let user = {
             "first_name":`${firstname}`,
             "last_name":`${lastname}`,
             "email": `${email}`, 
             "password": `${pass}`,
             "phone_number":`${phone}`,
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
             "phone_number":`${phone}`,
             "national_id":`${national_id}`,
             "account_number":`${aacc}`,
             "role":"INQUILINO"
           
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
            const request = await fetch("https://literate-spoon-x5vj4v74wq65299rj-3001.app.github.dev/api/private", {
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
            const request = await fetch(`${Url}/user/${id}`, {
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

    }