
import { Urlexport } from "./urls";
const Url =`${Urlexport}/issues`;


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
    create_issue_by_tenant: async (title, description, status, apartment_id, priority, type, start_date, end_day,tenant_name, address, token) => {
        let issue = {
            "title":title,
        "description":description,
        "status":status,
        "apartment_id":apartment_id,
        "priority":priority,
        "type":type,
        "start_date":start_date,
        "end_date":end_day,
        "tenant_name":tenant_name,
        "address":address
        
        };
        
        try {
            const request = await fetch(`${Url}/create_bytenant`, {
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
         getIssuesOpened: async (token) => {
            try {
                const request = await fetch(`${Url}/opened`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const response = await request.json();
                return response;
            } catch (error) {
                console.error(`Error al obtener incidencias `, error);
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