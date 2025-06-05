const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/incidents";

export const incidents = {
    getIncidentsByTenantId: async (tenantId, token) => {
        try {
            const request = await fetch(`${Url}/tenant/${tenantId}/incidents`, { //HUGO REVISAR
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error("Error al obtener las incidencias:", error);
            return { error: "Error al conectar con la API"};
        }
    }
};