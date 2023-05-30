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
        left={({ color, style }) => (
          <Icon
            iconName='shirt-outline'
            {...{ color }}
            style={{
              ...style,
              alignSelf: "center",
            }}
          />
        )}
        title='Change theme'
        description={(theme ?? "light") + " theme"}
        descriptionStyle={{ textTransform: "capitalize" }}
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
        left={({ color, style }) => (
          <List.Icon
            icon='cancel'
            {...{ color }}
            style={{
              ...style,
              alignSelf: "center",
            }}
          />
        )}
        description='Show onboarding on restart'
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
      <List.Section>
        <List.Subheader>Games & Extra</List.Subheader>
        <List.Item
          title='Chess'
          description='Relax yourself with an intellectual PVP game of chess'
          left={({ color, style }) => (
            <List.Icon
              icon='chess-knight'
              {...{ color }}
              style={{
                ...style,
                alignSelf: "center",
              }}
            />
          )}
          right={({ color, style }) => (
            <Icon
              iconComponentName='Entypo'
              iconName='chevron-right'
              {...{ color }}
              style={{
                ...style,
                alignSelf: "center",
              }}
            />
          )}
          onPress={() => navigation.navigate("Chess")}
        />
      </List.Section>
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
