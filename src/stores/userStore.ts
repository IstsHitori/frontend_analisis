import { create } from "zustand";
import type { User, UserRegister } from "@/types/User";
import { updateProfile, getAllUsers } from "@/services/userService";

interface UserState {
  users: User[];
  updateProfile: (userData: UserRegister) => Promise<string | undefined>;
  fetchGetUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  updateProfile: async (userData) => {
    return await updateProfile(userData);
  },
  fetchGetUsers: async () => {
    const users = await getAllUsers();
    if (users) {
      set({ users });
    }
  },
}));
