import { LinkingOptions } from "@react-navigation/native";
import { createURL, addEventListener } from "expo-linking";

import { RootStackParamList } from "../types";
import { DEFAULT_IMG_URL } from "./assets";

export const prefix = createURL("/");

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix],
  subscribe(listener) {
    const subscriber = addEventListener("url", ({ url }) => {
      console.log({ deepLink: url });
      listener(url);
    });
    return subscriber.remove;
  },
  config: {
    screens: {
      Main: "/",
      Game: {
        path: "game/:gameId",
        // parse: {
        //   gameId: gameId => `${gameId}`,
        // },
      },
      NotFound: "*",
    },
    initialRouteName: "Main",
  },
};

export const ONBOARDING_DATA = [
  {
    key: 1,
    title: "Lorem, ipsum dolor sit amet consectetur",
    text: "tenetur nam alias dignissimos placeat sequi atque officiis, architecto voluptatem praesentium hic cumque qui voluptas eligendi doloremque",
    image: DEFAULT_IMG_URL,
  },
  {
    key: 2,
    title: "Lorem, ipsum dolor sit amet consectetur",
    text: "tenetur nam alias dignissimos placeat sequi atque officiis, architecto voluptatem praesentium hic cumque qui voluptas eligendi doloremque",
    image: DEFAULT_IMG_URL,
  },
  {
    key: 3,
    title: "Lorem, ipsum dolor sit amet consectetur",
    text: "tenetur nam alias dignissimos placeat sequi atque officiis, architecto voluptatem praesentium hic cumque qui voluptas eligendi doloremque",
    image: DEFAULT_IMG_URL,
  },
];
