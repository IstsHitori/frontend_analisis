import {create} from "zustand"
import type { UserAuth } from "@/types/UserAuth"

interface AuthState {
    user: UserAuth | null;
    setUser: (user: UserAuth) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    user:null,
    setUser: (user) => set({ user }),
    logout: () => {
        localStorage.removeItem("analisis-token")
        set({ user: null })
    } ,
    isAuthenticated: () => !!localStorage.getItem("analisis-token")

}))