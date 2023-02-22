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

import { Edit, Game, NotFound, Onboarding } from "../screens";
import MainTabs from "./MainTabs";
import { useSettings } from "../hooks";
import { RootStackParamList } from "../types";
import { linking } from "../constants";

const AppStackNav = createSharedElementStackNavigator<RootStackParamList>();

const AppStack = () => {
  const { colors } = useTheme();
  const [theme, inistialState, setInitialState, hasOnboarded, setHasOnboarded] =
    useSettings(s => [
      s.theme,
      s.inistialState,
      s.setInitialState,
      s.hasOnboarded,
      s.setHasOnboarded,
    ]);
  const isDark = theme === "dark";

  return (
    <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      <NavigationContainer
        linking={linking}
        theme={isDark ? NavDarkTheme : NavLightTheme}
        initialState={inistialState}
        onStateChange={s => setInitialState(s)}
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
          initialRouteName={hasOnboarded ? "Main" : "Onboarding"}
        >
          <AppStackNav.Screen name='Main' component={MainTabs} />
          <AppStackNav.Screen
            name='Onboarding'
            component={Onboarding}
            options={{
              headerShown: false,
            }}
          />
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
