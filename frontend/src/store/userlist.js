import { create } from "zustand";

export const useUserListStore = create((set) => ({
    userList: [],
    setUserList: (userList) => set({ userList }),
}));

