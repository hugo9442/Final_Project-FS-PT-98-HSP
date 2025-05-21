  
  const Url = "https://literate-spoon-x5vj4v74wq65299rj-3001.app.github.dev/api/user"

  export const users = {

    createuser: async (email, pass) => {
        let user = {
            "email": `${email}`, "password": `${pass}`, "is_active":true
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