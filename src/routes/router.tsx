import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ViewLogin from "../views/ViewLogin";
import ViewRegister from "@/views/ViewRegister";
import RouteProtected from "@/layouts/RouteProtected";
import Dashboard from "@/views/Dashboard";
import ViewProfile from "@/views/ViewProfile";
import { ViewBiseccionIntroduction } from "@/views/biseccion/ViewIntroduction";
import { ViewVideos } from "@/views/biseccion/ViewVideos";
import { ViewCalculator } from "@/views/biseccion/ViewCalculator";

export const router = createBrowserRouter([
  {
    path: "/app",
    element: <RouteProtected />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/app/perfil",
        element: <ViewProfile />,
      },
      {
        path: "/app/biseccion/introduccion",
        element: <ViewBiseccionIntroduction />,
      },
      {
        path: "/app/biseccion/videos",
        element: <ViewVideos />,
      },
      {
        path: "/app/biseccion/calculadora",
        element: <ViewCalculator />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <ViewLogin />,
      },
      {
        path: "/registrarse",
        element: <ViewRegister />,
      },
    ],
  },
]);
