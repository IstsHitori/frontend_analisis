import { create } from "zustand";
import type { User, UserRegister } from "@/types/User";
import { updateProfile } from "@/services/userService";

interface UserState {
  users: User[];
  updateProfile: (userData: UserRegister) => Promise<string | undefined>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useUserStore = create<UserState>((set) => ({
  users: [],
  updateProfile: async (userData) => {
    return await updateProfile(userData);
  },
}));
