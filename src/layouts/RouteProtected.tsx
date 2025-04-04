import { Navigate, Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { SideNavBar } from "@/components/SideNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthProfile } from "@/hooks/auth/useAuthUserProfile";
import { useAuth } from "@/hooks/auth/useAuth";

const RouteProtected = () => {
  //
  useAuthProfile();
  const { isAuthenticated } = useAuth();
  //
  const navigate = useNavigate();
  //---
  const token = localStorage.getItem("analisis-token");
  //---
  const [activeSection, setActiveSection] = useState("introduccion");
  const [activeMethod, setActiveMethod] = useState("biseccion");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate, isAuthenticated]);

  return (
    <main className="max-h-screen flex flex-col overflow-hidden">
      {token ? (
        <div className="flex h-screen w-full flex-row overflow-hidden">
          <SidebarProvider>
            <SideNavBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              activeMethod={activeMethod}
              setActiveMethod={setActiveMethod}
            />
          </SidebarProvider>

          <div className="flex-1 overflow-auto pt-16 md:pt-0">
            <div className="p-2 md:p-4">
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </main>
  );
};

export default RouteProtected;
