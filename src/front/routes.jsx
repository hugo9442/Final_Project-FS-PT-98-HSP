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


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/acceso" element={<Acceso />} />
      <Route index element={<Home />} />  {/* Página raíz */}
      <Route path="demo" element={<Demo />} />
      <Route path="single/:theId" element={<Single />} />
    </Route>
  ),
  {
    // ⚙️ Activamos flags de futura compatibilidad con React Router v7
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);
