const Url = "https://miniature-sniffle-7vpgxp6x9g5vfwx97-3001.app.github.dev/contracts";


 export const contracts = {

    create_contract: async (start, end, document, owner_id, token) => {
    console.log("Subiendo contrato con PDF...");
    
    const formData = new FormData();
    formData.append("start_date", start);
    formData.append("end_date", end);
    formData.append("document", document); 
    formData.append("owner_id", owner_id);
    
    try {
        const request = await fetch(`${Url}/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` 
            },
            body: formData 
        });
        const response = await request.json();
        return response;
    } catch (error) {
        console.error("Error subiendo PDF:", error);
        return { error: "Error al subir el contrato" };
    }
},
getcontract: async () => {
        try {
            const request = await fetch(`${Url}/`, {
                method: "GET"
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
