import { Outlet } from "react-router-dom";
import bgLogin from "/bg-login.jpg";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <section className="grid md:grid-cols-2 place-items-center min-h-screen p-10 ">
      {/* Logo */}
      <div className="md:block display:none rounded-lg overflow-hidden">
        <img src={bgLogin} />
      </div>
      {/* Login o Register */}
      <div>
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
        <Outlet />
      </div>
    </section>
  );
}
