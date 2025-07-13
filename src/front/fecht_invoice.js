//const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/invoices"
const Url ="https://sample-service-name-bnt3.onrender.com/invoices";


export const Invoices = {

create_invoice: async (data, token) => {
   
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
 tenant_invoices: async (token) => {
        try {
            const request = await fetch(`${Url}`, {
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
     tenant_invoices_id: async (id, token) => {
        try {
            const request = await fetch(`${Url}/${id}`, {
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
    modify_invoice: async (id, token) => {
    let data={ "status":"cobrada"}
    try {
        const request = await fetch(`${Url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const response = await request.json();

        if (!request.ok) {
            console.error("Error al modificar la factura:", response.error || response.msg || response);
            return { error: response.error || response.msg || "Error desconocido al crear la factura" };
        }

        console.log("Factura Modificada:", response);
        return response;
    } catch (error) {
        console.error("Error de red o inesperado:", error);
        return { error: "No se pudo conectar al servidor" };
    }
},


     }