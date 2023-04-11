import {
  DarkTheme,
  DefaultTheme,
  InitialState,
  NavigationContainer,
  useTheme,
} from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { FC, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { Edit, Game, NotFound } from "../screens";
import MainTabs from "./MainTabs";
import { useSettings } from "../hooks";
import { RootStackParamList } from "../types";
import { getInitialURL, openURL } from "expo-linking";
import { linking, NAVIGATION_STATE_KEY } from "../constants";

const AppStackNav = createSharedElementStackNavigator<RootStackParamList>();

const AppStack: FC<Props> = ({ initialState }) => {
  const { colors } = useTheme();
  const theme = useSettings(s => s.theme);
  const isDark = theme === "dark";

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    getInitialURL().then(url => {
      url && openURL(url);
    });
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log({ notification });
        // setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log({ response });
        const deepLink = response.notification.request.content.data?.deepLink;
        if (typeof deepLink === "string") openURL(deepLink);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer
      {...{ linking, initialState }}
      theme={
        isDark
          ? {
              ...DarkTheme,
              colors: {
                ...DarkTheme.colors,
                background: "#121212",
              },
            }
          : DefaultTheme
      }
      onStateChange={state => {
        AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
      }}
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
    </NavigationContainer>
  );
};

export default AppStack;

type Props = {
  initialState?: InitialState;
};

type Subscription = {
  remove: () => void;
};
