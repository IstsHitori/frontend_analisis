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
  //---
  const [activeSection, setActiveSection] = useState("");
  const [activeMethod, setActiveMethod] = useState("");
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  return (
    <main className=" flex flex-col overflow-hidden">
      {isAuthenticated() ? (
        <div className="flex w-full flex-row ">
          <div>
            <SidebarProvider>
              <SideNavBar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                activeMethod={activeMethod}
                setActiveMethod={setActiveMethod}
              />
            </SidebarProvider>
          </div>

          <div className=" w-full pt-16 md:pt-0">
            <Outlet />
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
