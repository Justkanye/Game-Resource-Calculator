import {
  NavigationContainer,
  useTheme,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { useCallback } from "react";
import * as Linking from "expo-linking";

import { Edit, Game } from "../screens";
import MainTabs from "./MainTabs";
import { useSettings } from "../hooks";
import { RootStackParamList } from "../types";

const AppStack = () => {
  const AppStackNav = createSharedElementStackNavigator<RootStackParamList>();
  const { colors } = useTheme();
  const theme = useSettings(state => state.theme);
  const isDark = theme === "dark";
  const prefix = Linking.createURL("rsscalc://app");

  return useCallback(
    () => (
      <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar style='light' />
        <NavigationContainer
          linking={{
            prefixes: [prefix],
            subscribe(listener) {
              const subscriber = Linking.addEventListener("url", ({ url }) => {
                console.log({ url });
                listener(url);
              });
              return subscriber.remove;
            },
            config: {
              screens: {
                Main: "main",
                Game: {
                  path: "game/:gameId",
                  parse: {
                    gameId: gameId => `${gameId}`,
                  },
                },
              },
            },
          }}
          theme={isDark ? NavDarkTheme : NavLightTheme}
        >
          <AppStackNav.Navigator
            screenOptions={() => ({
              title: "Game Resource Calculator",
              headerStyle: isDark
                ? undefined
                : {
                    backgroundColor: colors.primary,
                  },
              headerTintColor: "#fff",
            })}
          >
            <AppStackNav.Screen name='Main' component={MainTabs} />
            <AppStackNav.Screen
              name='Game'
              initialParams={{
                gameId: undefined,
              }}
              component={Game}
            />
            <AppStackNav.Screen
              name='Edit'
              initialParams={{
                gameId: undefined,
              }}
              component={Edit}
            />
          </AppStackNav.Navigator>
        </NavigationContainer>
      </PaperProvider>
    ),
    [isDark, colors.primary]
  )();
};

export default AppStack;
