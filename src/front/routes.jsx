// Import necessary components and functions from react-router-dom.

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
import LoginSection from "./pages/Acceso"
import { PrivateRoutes } from "./pages/Privateroute";
import PropietarioIndex from "./pages/PropietarioIndex";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/acceso" element={<LoginSection />} />
       <Route element={<PrivateRoutes />}>
      <Route path="/propietarioindex" element={<PropietarioIndex />} />
        <Route path="/single/:theId" element={<Single />} />
        <Route path="/demo" element={<Demo />} />
      </Route>
    </Route>
  )
);
