const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/asociates";

export const Asociations = {
  
  createAsociation: async (tenant_id, contract_id, token) => {
    let asociate = {
      "tenant_id": tenant_id,
      "contract_id": contract_id,
      "is_active": Boolean(true),
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
  }
};
