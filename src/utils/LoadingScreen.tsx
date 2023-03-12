import { FC } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { StrokeAnimation } from "../components";

const LoadingScreen: FC<Props> = ({
  loadingText = "Loading",
  setinishedAnimation,
}) => {
  const backgroundColor = "#121212"; //#aaaaff
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
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
        <StrokeAnimation {...{ setinishedAnimation }} />
      </View>
      <Text
        style={{
          textAlign: "center",
          paddingBottom: 20,
          color: "#ccc",
        }}
      >
        {loadingText + "..."}
      </Text>
    </View>
  );
};

export default LoadingScreen;

type Props = {
  loadingText?: string;
  setinishedAnimation: (val: boolean) => void;
};
