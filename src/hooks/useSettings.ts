import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { combine, persist } from "zustand/middleware";

const getDefaultState = () => {
  let theme: ThemeMode;
  let expoPushToken: string | undefined;
  return { theme, expoPushToken };
};

const useSettings = create(
  persist(
    combine({ ...getDefaultState() }, set => ({
      setTheme: (theme: ThemeMode) => set({ theme }),
      setExpoPushToken: (expoPushToken?: string) => set({ expoPushToken }),
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
