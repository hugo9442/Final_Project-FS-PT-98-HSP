
const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/issues"

export const issues = {

create_issue: async (title, description, status, apartment_id, priority, type, start_date, token) => {
        let issue = {
            "title":title,
        "description":description,
        "status":status,
        "apartment_id":apartment_id,
        "priority":priority,
        "type":type,
        "start_date":start_date,
        "end_date":"2100-06-06"
        
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
    }
 }