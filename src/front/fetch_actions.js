//const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/actions";
const Url ="https://sample-service-name-bnt3.onrender.com/actions";

export const action={

       getActionsWithoutExpensesOrDocs: async (apartmentId,token) => {
 
    try {
      const request = await fetch(`${Url}/by-apartment/${apartmentId}/no-expenses-docs`, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
     
      });
      const response = await request.json();
      console.log(response);
      return response;
    }catch (error) {
    console.error("Error al obtener asociaciones completas:", error);
    throw error; // para que puedas capturarlo desde el componente que llama
  }
},



}