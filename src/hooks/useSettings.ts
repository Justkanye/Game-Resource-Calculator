import AsyncStorage from "@react-native-async-storage/async-storage";
import { InitialState } from "@react-navigation/native";
import create from "zustand";
import { combine, persist } from "zustand/middleware";

const getDefaultState = () => {
  let theme: ThemeMode;
  let inistialState: InitialState | undefined;
  return { theme, inistialState, hasOnboarded: false };
};

const useSettings = create(
  persist(
    combine({ ...getDefaultState() }, set => ({
      setTheme: (theme: ThemeMode) => set({ theme }),
      setInitialState: (inistialState?: InitialState) => set({ inistialState }),
      setHasOnboarded: (hasOnboarded: boolean) => set({ hasOnboarded }),
      toggleTheme: () =>
        set(prev => ({ theme: prev.theme === "dark" ? "light" : "dark" })),
      reset: () => set(getDefaultState()),
    })),
    {
      name: "Game_RSS_Calc_persist_settings",
      getStorage: () => AsyncStorage,
    }
  )
);

export default useSettings;

type ThemeMode = "dark" | "light" | undefined;
