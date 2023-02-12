import AnimatedLottieView from "lottie-react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { DELEVERING } from "../constants";

const LoadingScreen = ({ loadingText = "Loading" }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#aaaaff",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <AnimatedLottieView
          source={DELEVERING}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          paddingBottom: 20,
        }}
      >
        {loadingText + "..."}
      </Text>
    </View>
  );
};

export default LoadingScreen;
