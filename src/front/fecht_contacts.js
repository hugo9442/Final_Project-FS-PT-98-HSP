//const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/contacts";
const Url ="https://sample-service-name-bnt3.onrender.com/asociates";

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