//const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/dashboard";
const Url ="https://sample-service-name-bnt3.onrender.com/dashboard";

export const dashboard={

    getMonhtlySumary: async (token) => {
        try {
            const request = await fetch(`${Url}/monthly-summary`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error("Error al obtener la vivienda del inquilino:", error);
            return { error: "Error al conectar con la API" };
        }
    },

}
