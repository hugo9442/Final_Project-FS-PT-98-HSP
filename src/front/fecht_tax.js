import { Urlexport } from "./urls";
const Url =`${Urlexport}`;

export const tax={

 gettaxt: async (token) => {
            try {
                const request = await fetch(`${Url}/iva`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const response = await request.json();
                return response;
            } catch (error) {
                console.error(`Error al obtener IVAS`, error);
                return { error: "Error al conectar con la API"};
            }
        },
       
}