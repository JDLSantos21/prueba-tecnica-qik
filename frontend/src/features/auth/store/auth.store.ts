import { create } from "zustand";
import { tokenService } from "../services/token.service";
import { User } from "../types/auth.types";
import { apolloClient, setOnUnauthorizedCallback } from "@/lib/apollo/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  logout: async () => {
    await tokenService.removeToken();
    await apolloClient.clearStore();
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const token = await tokenService.getToken();
      set({
        isAuthenticated: !!token,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));

setOnUnauthorizedCallback(() => {
  useAuthStore.getState().logout();
});
