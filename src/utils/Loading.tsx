import AnimatedLottieView from "lottie-react-native";
import { View } from "react-native";

import { LOADING } from "../constants";

const Loading = () => (
  <View
    style={{
      width: "100%",
      justifyContent: "center",
      flexDirection: "row",
    }}
  >
    <AnimatedLottieView
      source={LOADING}
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />
  </View>
);

export default Loading;
