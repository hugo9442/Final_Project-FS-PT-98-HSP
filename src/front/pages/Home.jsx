import React, { useEffect } from "react"
import viviendaUrl from "../assets/img/vivienda2.jpg"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Navbar from "../components/Navbar.jsx"
import Card from "../components/Card.jsx"

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
  <div className="mt-5">
    <h1 className="text-center display-4">Gestión Inmuebles</h1>
    <p className="text-center lead">

      <img
        src={viviendaUrl}
        className="img-fluid mb-3 mt-3"
        alt="Rigo Baby"
      />
	  
    </p>

    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-4 d-flex justify-content-center mb-4">
          <Card
            image="https://via.placeholder.com/300x200"
            text="Propiedad 1"
            alt="Propiedad 1"
          />
        </div>
        <div className="col-md-4 d-flex justify-content-center mb-4">
          <Card
            image="https://via.placeholder.com/300x200"
            text="Propiedad 2"
            alt="Propiedad 2"
          />
        </div>
        <div className="col-md-4 d-flex justify-content-center mb-4">
          <Card
            image="https://via.placeholder.com/300x200"
            text="Propiedad 3"
            alt="Propiedad 3"
          />
        </div>
      </div>
    </div>
  </div>
);

};


