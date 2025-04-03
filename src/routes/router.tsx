import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ViewLogin from "../views/ViewLogin";
import ViewRegister from "@/views/ViewRegister";

export const router = createBrowserRouter([
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
