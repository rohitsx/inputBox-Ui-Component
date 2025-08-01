import { create } from "zustand";

type Store = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export const useThemeStore = create<Store>()((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme == "dark" ? "light" : "dark" })),
}));
