import { View } from "react-native";

import { StrokeAnimation } from "../components";

const backgroundColor = "#121212"; //#aaaaff

const LoadingScreen = ({ setFinishedAnimation }: Props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      <StrokeAnimation {...{ setFinishedAnimation }} />
    </View>
  );
};

export default LoadingScreen;

type Props = {
  setFinishedAnimation: (val: boolean) => void;
};
