//const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/taxhold";
const Url ="https://sample-service-name-bnt3.onrender.com/asociates";

export const taxholding={

        getholding: async (token) => {
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
                console.error(`Error al obtener retenciones:`, error);
                return { error: "Error al conectar con la API"};
            }
        },
}