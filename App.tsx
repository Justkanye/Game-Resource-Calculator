import { useEffect } from "react";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

import AppStack from "./src/routes/AppStack";

export default function App() {
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
  }, []);

  return <AppStack />;
}
