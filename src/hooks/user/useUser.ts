import { useUserStore } from "@/stores/userStore";
export const useUser = () => {
  const setUsers = useUserStore((state) => state.fetchGetUsers);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const users = useUserStore((state) => state.users);

  console.log("users", users);
  return {
    updateProfile,
    users,
    setUsers,
  };
};
