import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Acceso from "./pages/Acceso";
import Contact from "./pages/Contact";
import Servicios from "./pages/Servicios";
import PropietarioIndex from "./pages/PropietarioIndex";
import InquilinoIndex from "./pages/InquilinoIndex";
import Contrato from "./pages/Contrato";
import Incidencias from "./pages/Incidencias";
import Inquilinos from "./pages/Inquilinos";
import Viviendas from "./pages/Viviendas";
import { PrivateRoutes } from "./pages/Privateroute";
import Alquileres from "./pages/Alquileres";
import ViviendasAssoc from "./pages/ViviendasAssoc";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      <Route index element={<Home />} /> {/* Página raíz */}
      <Route path="/acceso" element={<Acceso />} />
      <Route path="/reset-password" element={<Acceso />} />
      <Route path="/forgot-password" element={<Acceso />} />
      <Route path="/set-password" element={<Acceso />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/contact" element={<Contact />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/propietarioindex" element={<PropietarioIndex />} />
        <Route path="/Viviendas" element={<Viviendas />} />
        <Route path="/alquileres" element={<Alquileres />} />
        <Route path="/InquilinoIndex" element={<InquilinoIndex />} />
        <Route path="/single/:theId" element={<Single />} />
        <Route path="/Incidencias" element={<Incidencias />} />
        <Route path="/Inquilinos" element={<Inquilinos />} />
        <Route path="/viviendasassoc/:theId" element={<ViviendasAssoc />} />
        <Route path="/Contrato" element={<Contrato />} />
      </Route>

    </Route>
  ),
  {
    // ⚙️ Activamos flags de futura compatibilidad con React Router v7
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
