import { Urlexport } from "./urls";
const Url =`${Urlexport}/contacts`;


export const Contacts={

    contact_create : async (data) => {
    

   

    try {
      const response = await fetch(`${Url}/create`, {
    
        method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(data)
      });

       if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del backend:", errorData.error || errorData);
        return { error: errorData.error || "Error en el servidor" };
      }

      return await response.json();
    } catch (error) {
      console.error("Error de red:", error);
      return { error: "Error de conexión. Revisa tu red" };
    }
 }
}