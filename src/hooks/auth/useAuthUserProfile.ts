import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { fetchUserProfile } from "@/services/authService";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

export const useAuthProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserProfile();
        if (!user) {
          toast.error("No se pudo obtener el perfil del usuario");
          return;
        }
        setUser(user);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchUser();
  }, [setUser]);
};
