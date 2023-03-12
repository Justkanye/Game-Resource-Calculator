import { FC } from "react";
import { useWindowDimensions, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { OnboardingItemType } from "../types";

const OnboardingPaginator: FC<Props> = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const getStyle = (index: number) =>
    useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      const dotWidth = interpolate(
        scrollX.value,
        inputRange,
        [10, 20, 10],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );
      return {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: colors.accent, //"#493d8a",
        width: dotWidth,
        opacity,
      };
    }, [scrollX.value, width, colors.accent]);
  return (
    <View style={{ flexDirection: "row", marginVertical: 15 }}>
      {data.map(({ key }, index) => {
        return <Animated.View {...{ key, style: getStyle(index) }} />;
      })}
    </View>
  );
};

export default OnboardingPaginator;

type Props = {
  data: OnboardingItemType[];
  scrollX: SharedValue<number>;
};
