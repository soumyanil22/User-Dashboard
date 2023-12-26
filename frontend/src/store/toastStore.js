import { create } from 'zustand';

export const useToastStore = create((set) => ({
    toast: {
        message: '',
        isOpen: false,
    },
    show: (message) => set({ toast: { message, isOpen: true } }),
    hide: () => set({ toast: { message: '', isOpen: false } }),
}));