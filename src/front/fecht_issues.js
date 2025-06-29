
const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/issues"

export const Issues = {

create_issue: async (title, description, status, apartment_id, priority, type, start_date, end_day, token) => {
        let issue = {
            "title":title,
        "description":description,
        "status":status,
        "apartment_id":apartment_id,
        "priority":priority,
        "type":type,
        "start_date":start_date,
        "end_date":end_day
        
        };
        
        try {
            const request = await fetch(`${Url}/create`, {
                method: "POST",
                headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer  ${token}`
                },  
                body: JSON.stringify(issue)

            })
            const response = await request.json();
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
            return error

        }
    },
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
        },
     getIssues: async (token) => {
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
                console.error(`Error al obtener incidencias para el apartamento ${apartmentId}:`, error);
                return { error: "Error al conectar con la API", issues: [] };
            }
        },
     CloseIssues: async (id,token) => {
            try {
                const request = await fetch(`${Url}/${id}/close`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const response = await request.json();
                return response;
            } catch (error) {
                console.error(`Error al cerrar la incidencia con ID ${id}:`, error);
                return { error: "Error al conectar con la API", issues: [] };
            }
        }
 }