import { Urlexport } from "./urls";
const Url =`${Urlexport}/contractor`;



export const contractor={
 getContractor:async (token) => {
        try {
            const request = await fetch(`${Url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error("Error al obtener contratistas:", error);
            return { error: "Error al conectar con la API" };
        }

},
 create: async (formdata, token) => {
        
        
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer  ${token}`
                },  
                body: JSON.stringify(formdata)

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