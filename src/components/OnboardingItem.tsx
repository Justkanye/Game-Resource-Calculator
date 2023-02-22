import { FC } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { OnboardingItemType } from "../types";

const OnboardingItem: FC<OnboardingItemType> = ({ image, text, title }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ ...styles.container, width }}>
      <Image
        source={image}
        style={{ ...styles.image, width, resizeMode: "contain" }}
      />
      <View style={{ flex: 0.3 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { flex: 0.7, justifyContent: "center" },
  title: {
    fontWeight: "800",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
    color: "#493d8a",
  },
  text: {
    fontWeight: "300",
    textAlign: "center",
    paddingHorizontal: 64,
    color: "#62656b",
  },
});
