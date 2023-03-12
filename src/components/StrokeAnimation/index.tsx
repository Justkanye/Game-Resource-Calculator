import { FC, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg from "react-native-svg";
import { PATHS } from "../../constants";
import AnimatedStroke from "./AnimatedStroke";

const strokeWidth = 2;
const vWidth = 246 + strokeWidth;
const vHeight = 61 + strokeWidth;
const halfStroke = strokeWidth / 2;

const StrokeAnimation: FC<Props> = ({ setinishedAnimation }) => {
  const { width } = useWindowDimensions();
  const svgWidth = width - 32;
  const svgHeight = (svgWidth * vHeight) / vWidth;
  const progress = useSharedValue(0);
  const bgProgress = useSharedValue(0);
  const duration = 40000;

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration, easing: Easing.bezier(0.65, 0, 0.35, 1) },
      () => runOnJS(setinishedAnimation)(true)
    );
    bgProgress.value = withTiming(1, {
      duration,
      easing: Easing.bezier(0.61, 1, 0.88, 1),
    });
  }, []);

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      viewBox={[
        -halfStroke,
        -halfStroke,
        vWidth + halfStroke,
        vHeight + halfStroke,
      ].join(" ")}
    >
      {PATHS.map((d, key) => (
        <AnimatedStroke {...{ d, key, strokeWidth, progress, bgProgress }} />
      ))}
    </Svg>
  );
};

export default StrokeAnimation;

type Props = {
  setinishedAnimation: (val: boolean) => void;
};
