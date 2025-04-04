import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ViewLogin from "../views/ViewLogin";
import ViewRegister from "@/views/ViewRegister";
import RouteProtected from "@/layouts/RouteProtected";
import Dashboard from "@/views/Dashboard";

export const router = createBrowserRouter([
  {
    path:"/app",
    element:<RouteProtected />,
    children:[
      {
        index:true,
        element:<Dashboard />
      }
    ]
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
