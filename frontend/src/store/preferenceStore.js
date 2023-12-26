import { create } from 'zustand';

export const usePreferenceStore = create((set) => ({
    theme: 'light',
    setTheme: (theme) => set({ theme }),
}));