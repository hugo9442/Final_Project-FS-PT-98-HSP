import { Urlexport } from "./urls";
const Url =`${Urlexport}/adminowner`;



export const admin = {
    
    createOwnerRelation: async (newOwner_id, admin_id, token) => {
        let asoc = {
             "owner_id":newOwner_id,
             "admin_id":admin_id
        
             
        };
        const response = await fetch(`${Url}/associate`, {
            method: "POST",
            headers: { "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify(asoc),
        });
        return await response.json();
    },
    getOwnersByAdmin: async (admin_id, token) => {
        try {
            const response = await fetch(`${Url}/owners/${admin_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // si usas JWT
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data; // devuelve { admin_id, owners_act, owners_inac }
        } catch (error) {
            console.error("Error al obtener owners del admin:", error);
            return null;
        }
    }
};