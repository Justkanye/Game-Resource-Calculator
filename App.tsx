import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

import AppStack from "./src/routes/AppStack";
import { loadAsync } from "expo-font";
import { YENSEVA_ONE } from "./src/constants";
import { LoadingScreen } from "./src/utils";

export default function App() {
  const [isLoaded, setIsloaded] = useState(false);
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
    }).then(() => setIsloaded(true));
  }, []);
  if (!isLoaded) return <LoadingScreen />;
  return <AppStack />;
}
