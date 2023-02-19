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
import { addEventListener } from "expo-linking";

import { Edit, Game, NotFound } from "../screens";
import MainTabs from "./MainTabs";
import { useSettings } from "../hooks";
import { RootStackParamList } from "../types";
import { prefix } from "../constants";

const AppStackNav = createSharedElementStackNavigator<RootStackParamList>();

const AppStack = () => {
  const { colors } = useTheme();
  const [theme, inistialState, setInitialState] = useSettings(s => [
    s.theme,
    s.inistialState,
    s.setInitialState,
  ]);
  const isDark = theme === "dark";
  // console.log({ prefix });

  return (
    <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      <NavigationContainer
        linking={{
          prefixes: [prefix],
          subscribe(listener) {
            const subscriber = addEventListener("url", ({ url }) => {
              console.log({ url });
              listener(url);
            });
            return subscriber.remove;
          },
          config: {
            screens: {
              Main: "/",
              Game: {
                path: "game/:gameId",
                parse: {
                  gameId: gameId => `${gameId}`,
                },
              },
              NotFound: "*",
            },
          },
        }}
        theme={isDark ? NavDarkTheme : NavLightTheme}
        initialState={inistialState}
        onStateChange={s => s && setInitialState(s)}
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
            headerTitleStyle: {
              fontFamily: "YesevaOne-Regular",
            },
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
          <AppStackNav.Screen name='NotFound' component={NotFound} />
        </AppStackNav.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppStack;
