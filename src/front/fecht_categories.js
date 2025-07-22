import { Urlexport } from "./urls";
const Url =`${Urlexport}/categories`;



export const categories={
 getcategories:async (token) => {
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
 }