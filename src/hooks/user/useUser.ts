import { useUserStore } from "@/stores/userStore";
export const useUser = () => {
  const updateProfile = useUserStore((state) => state.updateProfile);
  const users = useUserStore((state) => state.users);
  return {
    updateProfile,
    users,
  };
};
