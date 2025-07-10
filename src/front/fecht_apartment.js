const Url = "https://special-couscous-wrpgj9jx4q92v6xw-3001.app.github.dev/apartments";
//const Url ="https://sample-service-name-bnt3.onrender.com/apartments";


export const apartments = {

  create_apartment: async (
    address,
    postal_code,
    city,
    parking,
    type,
    is_rent,
    owner_id,
    token
  ) => {
    let apart = {
      address: address,
      postal_code: postal_code,
      city: city,
      parking_slot: parking,
      type:type,
      is_rent: Boolean(is_rent),
      owner_id: owner_id,
    };
    console.log(apart);
    try {
      const request = await fetch(`${Url}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer  ${token}`,
        },
        body: JSON.stringify(apart),
      });
      const response = await request.json();
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  getApartmentByTenantId: async (token) => {
        try {
            const request = await fetch(`${Url}/tenant_apartment`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error("Error al obtener la vivienda del inquilino:", error);
            return { error: "Error al conectar con la API" };
        }
    },
    getApartmentsWithOwner: async (token) => {
    try {
        const response = await fetch(`${Url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Error al obtener los apartamentos");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener los apartamentos con propietario:", error);
        return { error: "Error al conectar con la API" };
    }
},
getApartmentswithdocuments: async (token) => {
    try {
        const response = await fetch(`${Url}/with-documents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Error al obtener los apartamentos");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error al obtener los apartamentos con propietario:", error);
        return { error: "Error al conectar con la API" };
    }
},
    getIssuesActionsByApertmentId: async (id,token) => {
        try {
            const request = await fetch(`${Url}/${id}/issues-actions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const response = await request.json();
            return response;
        } catch (error) {
            console.error("Error al Obtener Incidencias y Actuaciones:", error);
            return { error: "Error al conectar con la API" };
        }
    },
    
};
