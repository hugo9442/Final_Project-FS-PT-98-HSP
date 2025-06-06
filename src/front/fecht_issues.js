const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/issues";

export const issues = {
    getIssuesByApartmentId: async (apartmentId, token) => {
        try {
            const request = await fetch(`${Url}/apartment/${apartmentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error(`Error al obtener incidencias para el apartamento ${apartmentId}:`, error);
            return { error: "Error al conectar con la API", issues: [] };
        }
    }
};