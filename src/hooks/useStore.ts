import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";
import { combine, persist } from "zustand/middleware";

import { updateObj } from "../helpers";
import { Game } from "../types";

const getDefaultState = () => {
  const games: Game[] = [];

  return {
    games,
    chessFen: "",
  };
};

const useStore = create(
  persist(
    combine({ ...getDefaultState() }, set => ({
      addGame: (game: Game) =>
        set(({ games }) => {
          if (!game) return { games };
          const index = games.findIndex(g => g.id === game.id);
          if (index < 0) return { games: [game, ...games] };
          else {
            let newGames = games;
            newGames[index] = updateObj(newGames[index], game);
            return { games: newGames };
          }
        }),
      deleteGame: (gameId: string) =>
        set(({ games }) => ({
          games: games.filter(game => game.id !== gameId),
        })),
      setChessFen: (chessFen: string) => set({ chessFen }),
      reset: () => set(getDefaultState()),
    })),
    {
      name: "Game_RSS_Calc_persist_store",
      getStorage: () => AsyncStorage,
    }
  )
);

export default useStore;
