import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    tokenExpired: false,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    clearToken: () => set({ token: null }),
    setTokenExpired: (tokenExpired) => set({ tokenExpired }),
    initializeToken: (storedToken) => {
        if (storedToken) {
            set({ token: storedToken });
        }
    },
}));