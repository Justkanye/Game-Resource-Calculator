import { useEffect, useRef, useState } from "react";
import * as Updates from "expo-updates";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from "@react-navigation/native";
import { loadAsync } from "expo-font";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";

import AppStack from "./src/routes/AppStack";
import {
  linking,
  NAVIGATION_STATE_KEY,
  ONBOARDING_STATE_KEY,
  YENSEVA_ONE,
} from "./src/constants";
import { LoadingScreen } from "./src/utils";
import { OnboardingState } from "./src/types";
import { Onboarding } from "./src/screens";
import { isDevice } from "expo-device";
import { useSettings } from "./src/hooks";
import { openURL } from "expo-linking";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [loadedFonts, setLoadedFonts] = useState(false);
  const [loadedOnboardingState, setLoadedOnboardingState] = useState(false);
  const [loadedNavigationState, setLoadedNavigationState] = useState(false);
  const [finishedAnimation, setinishedAnimation] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentIndex: 0,
    hasOnboarded: false,
  });
  const [initialState, setInitialState] = useState<InitialState>();

  const [setExpoPushToken, theme] = useSettings(s => [
    s.setExpoPushToken,
    s.theme,
  ]);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const isDark = theme === "dark";

  useEffect(() => {
    Updates.addListener(event => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE)
        Alert.alert(
          "Update Available",
          "A new update is avavlable. You need to restart the app to use the new features.",
          [
            {
              text: "Later",
              style: "cancel",
            },
            {
              text: "Restart",
              onPress: Updates.reloadAsync,
            },
          ]
        );
    });
    loadAsync({
      "YesevaOne-Regular": YENSEVA_ONE,
    })
      .catch(loadFontErr => console.log({ loadFontErr }))
      .finally(() => setLoadedFonts(true));
    AsyncStorage.getItem(ONBOARDING_STATE_KEY, (getOnboardErr, res) => {
      if (getOnboardErr) console.log({ getOnboardErr });
      if (res) setOnboardingState(JSON.parse(res));
      setLoadedOnboardingState(true);
    });
    AsyncStorage.getItem(NAVIGATION_STATE_KEY, (err, val) => {
      if (err) console.log("NAVIGATION_STATE error: ", err);
      if (val) setInitialState(JSON.parse(val));
      setLoadedNavigationState(true);
    });
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

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

  const renderChildren = () => {
    if (
      !loadedFonts ||
      !loadedOnboardingState ||
      !loadedNavigationState ||
      !finishedAnimation
    )
      return <LoadingScreen {...{ setinishedAnimation }} />;
    if (!onboardingState.hasOnboarded)
      return <Onboarding {...{ setOnboardingState, onboardingState }} />;
    return <AppStack />;
  };

  return (
    <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      <NavigationContainer
        linking={linking}
        theme={isDark ? NavDarkTheme : NavLightTheme}
        initialState={initialState}
        onStateChange={state => {
          AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
        }}
      >
        {renderChildren()}
      </NavigationContainer>
    </PaperProvider>
  );
}

type Subscription = {
  remove: () => void;
};

async function registerForPushNotificationsAsync() {
  let token;
  if (isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log({ token });
    } catch (getExpoPushTokenErr) {
      console.log({ getExpoPushTokenErr });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
