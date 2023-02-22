import { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { OnboardingItemType } from "../types";

const OnboardingPaginator: FC<Props> = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
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
        backgroundColor: "#493d8a",
        width: dotWidth,
        opacity,
      };
    }, [scrollX.value]);
  return (
    <View style={styles.container}>
      {data.map(({ key }, index) => {
        return <Animated.View {...{ key, style: getStyle(index) }} />;
      })}
    </View>
  );
};

export default OnboardingPaginator;

const styles = StyleSheet.create({
  container: { flexDirection: "row", height: 64 },
});

type Props = {
  data: OnboardingItemType[];
  scrollX: SharedValue<number>;
};
