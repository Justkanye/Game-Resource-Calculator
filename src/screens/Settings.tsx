import AnimatedLottieView from "lottie-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompositeScreenProps } from "@react-navigation/native";
import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";

import { useSettings } from "../hooks";
import { ONBOARDING_STATE_KEY, THEME_ANIMATION } from "../constants";
import { Icon, Title } from "../utils";
import { MainTabParamList, RootStackParamList } from "../types";

const Settings = ({ navigation }: Props) => {
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
      <Title title='Settings' />
      <List.Item
        left={() => <Icon iconName='shirt-outline' />}
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
        left={() => <Icon iconName='close-sharp' />}
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
      <List.Item
        title='Chess'
        description='Relax yourself with an intellectual PVP game of chess'
        left={() => (
          <Icon
            iconName='shirt-outlinechess-knight'
            iconComponentName='MaterialCommunityIcons'
          />
        )}
        right={() => (
          <Icon
            iconComponentName='Entypo'
            iconName='chevron-right'
            color={theme === "dark" ? "#fff" : "#000"}
          />
        )}
        onPress={() => navigation.navigate("Chess")}
      />
    </View>
  );
};

export default Settings;

type Props = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, "Settings">,
  StackScreenProps<RootStackParamList, "Main">
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: 50,
    height: 50,
  },
});
