const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/asociates";
//const Url ="https://sample-service-name-bnt3.onrender.com/asociates";


export const Asociations = {
  
  createAsociation: async (tenant_id, contract_id, renta, token) => {
    let asociate = {
      "tenant_id": tenant_id,
      "contract_id": contract_id,
      "renta": renta,
      "is_active": Boolean(true)
    };
  
    try {
      const request = await fetch(`${Url}/create`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer  ${token}`
        },
        body: JSON.stringify(asociate),
      });
      const response = await request.json();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  updateasociation:async (apartment_id, id, token) => {
    let asociate = {
  "association": {
    "apartment_id": apartment_id
  },
  "apartment": {
    "is_rent": true
  }
}
  
    try {
      const request = await fetch(`${Url}/update-association-apartment/${id}/${apartment_id}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(asociate),
      });
      const response = await request.json();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  updateasociationdeleterent:async ( assoc_id, apartment_id, token) => {
    let asociate = {
  "association": {
    "is_active": false
  },
  "apartment": {
    "is_rent": false
  }
}
  console.log(asociate)
    try {
      const request = await fetch(`${Url}/delete-association-apartment/${assoc_id}/${apartment_id}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(asociate),
      });
      const response = await request.json();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  get_full_asociates:async (token) => {
 
    try {
      const request = await fetch(`${Url}/full`, {
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
get_associations_without_apartment:async (token) => {
 
    try {
      const request = await fetch(`${Url}/no-apartment`, {
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
}
  
};
