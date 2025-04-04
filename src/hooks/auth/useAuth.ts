import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    logout,
    isAuthenticated
  };
};
