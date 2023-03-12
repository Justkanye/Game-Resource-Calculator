import { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { OnboardingItemType } from "../types";

const OnboardingItem: FC<OnboardingItemType> = ({ text, title, Svg }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  return (
    <View style={{ ...styles.container, width }}>
      <Svg {...{ width }} style={{ ...styles.image }} fill={colors.accent} />
      <View style={{}}>
        <Text style={{ ...styles.title, color: colors.primary }}>{title}</Text>
        <Text style={{ ...styles.text }}>{text}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", alignItems: "center" },
  image: { flex: 0.7, justifyContent: "center" },
  title: {
    fontWeight: "800",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
    // color: "#493d8a",
    paddingHorizontal: 5,
  },
  text: {
    fontWeight: "300",
    textAlign: "center",
    paddingHorizontal: 50,
    // color: "#62656b",
  },
});
