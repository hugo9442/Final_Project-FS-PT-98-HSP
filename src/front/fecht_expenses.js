import { Urlexport } from "./urls";
const Url =`${Urlexport}/expenses`;



export const expenses={

    expensesCreate:async (data, token) => {
   
    try {
        const request = await fetch(`${Url}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();

        if (!request.ok) {
            console.error("Error al crear factura:", response.error || response.msg || response);
            return { error: response.error || response.msg || "Error desconocido al crear la factura" };
        }

        console.log("Factura creada:", response);
        return response;
    } catch (error) {
        console.error("Error de red o inesperado:", error);
        return { error: "No se pudo conectar al servidor" };
    }
},
   get_expenses_by_apartmet: async (apartment_id,token) => {
        try {
            const request = await fetch(`${Url}/by-apartment/${apartment_id}`, {
                method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
    getMonthlySummary: async (token) => {
        try {
            const request = await fetch(`${Url}/monthly-summary`, {
                method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
     get_expenses_by_contractor: async (contractorId, token) => {
        try {
            const request = await fetch(`${Url}/by-contractor/${contractorId}`, {
                method: "GET", 
                 headers: {
                    "Authorization": `Bearer  ${token}`
                },
            })
            const response = await request.json();
            
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
        
    

}