import { useTheme } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { useEffect } from "react";

import { Edit, Game, NotFound } from "../screens";
import MainTabs from "./MainTabs";
import { useSettings } from "../hooks";
import { RootStackParamList } from "../types";
import { getInitialURL, openURL } from "expo-linking";

const AppStackNav = createSharedElementStackNavigator<RootStackParamList>();

const AppStack = () => {
  const { colors } = useTheme();
  const theme = useSettings(s => s.theme);
  const isDark = theme === "dark";

  useEffect(() => {
    getInitialURL().then(url => {
      url && openURL(url);
    });
  }, []);

  return (
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
      initialRouteName={"Main"}
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
  );
};

export default AppStack;
