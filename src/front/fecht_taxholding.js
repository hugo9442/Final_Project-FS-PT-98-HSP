import { Urlexport } from "./urls";
const Url =`${Urlexport}`;

export const taxholding={

        getholding: async (token) => {
            try {
                const request = await fetch(`${Url}/taxhold`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const response = await request.json();
                return response;
            } catch (error) {
                console.error(`Error al obtener retenciones:`, error);
                return { error: "Error al conectar con la API"};
            }
        },
}