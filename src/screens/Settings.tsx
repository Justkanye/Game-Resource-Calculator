import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import { useEffect, useRef } from "react";

import { useSettings } from "../hooks";
import { ONBOARDING_STATE_KEY, THEME_ANIMATION } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  const [toggleTheme, theme] = useSettings(s => [s.toggleTheme, s.theme]);
  const lottieRef = useRef<AnimatedLottieView>(null);

  useEffect(() => {
    if (theme === "dark") {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.pause();
    }
  }, [theme]);

  return (
    <View style={styles.container}>
      <List.Item
        title='Change theme'
        description={(theme ?? "light") + " mode"}
        onPress={toggleTheme}
        right={() => (
          <TouchableOpacity onPress={toggleTheme}>
            <AnimatedLottieView
              source={THEME_ANIMATION}
              loop={false}
              style={styles.lottie}
              ref={lottieRef}
              progress={theme === "dark" ? 1 : 0}
            />
          </TouchableOpacity>
        )}
      />
      <List.Item
        title='Clear Onboarding State'
        onPress={() =>
          AsyncStorage.setItem(
            ONBOARDING_STATE_KEY,
            JSON.stringify({ currentIndex: 0, hasOnboarded: false }),
            err => {
              if (err) console.log({ err });
              else alert("Onboarding state cleared");
            }
          )
        }
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: 50,
    height: 50,
  },
});
