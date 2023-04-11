import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InitialState } from "@react-navigation/native";
import { loadAsync } from "expo-font";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from "react-native-paper";
import { isDevice } from "expo-device";

import AppStack from "./src/routes/AppStack";
import {
  NAVIGATION_STATE_KEY,
  ONBOARDING_STATE_KEY,
  YENSEVA_ONE,
} from "./src/constants";
import { LoadingScreen } from "./src/utils";
import { OnboardingState } from "./src/types";
import { Onboarding } from "./src/screens";
import { useSettings } from "./src/hooks";

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
  const [finishedAnimation, setFinishedAnimation] = useState(false);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentIndex: 0,
    hasOnboarded: false,
  });
  const [initialState, setInitialState] = useState<InitialState>();

  const theme = useSettings(s => s.theme);

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
  }, []);

  const renderChildren = () => {
    if (
      !loadedFonts ||
      !loadedOnboardingState ||
      !loadedNavigationState ||
      !finishedAnimation
    )
      return <LoadingScreen {...{ setFinishedAnimation }} />;
    if (!onboardingState.hasOnboarded)
      return <Onboarding {...{ setOnboardingState, onboardingState }} />;
    return <AppStack {...{ initialState }} />;
  };

  return (
    <PaperProvider theme={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      {renderChildren()}
    </PaperProvider>
  );
}

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
