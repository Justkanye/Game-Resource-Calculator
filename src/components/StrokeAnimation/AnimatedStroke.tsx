import { FC, useRef, useState } from "react";
import { Colors } from "react-native-paper";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { Path, PathProps } from "react-native-svg";
import { getRandEl } from "../../helpers";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const strokeColors = [Colors.orange300, Colors.blue300, Colors.red300, "#ccc"];
const stroke = getRandEl(strokeColors);

const AnimatedStroke: FC<Props> = ({
  d,
  strokeWidth,
  progress,
  bgProgress,
}) => {
  const [length, setLength] = useState(0);
  const ref = useRef<typeof AnimatedPath>(null);
  const animatedProps = useAnimatedProps<PathProps>(() => ({
    strokeDashoffset: length - length * progress.value,
  }));
  const bgAnimatedProps = useAnimatedProps<PathProps>(() => ({
    strokeDashoffset: length - length * bgProgress.value,
  }));

  return (
    <>
      <AnimatedPath
        // @ts-ignore
        ref={ref}
        // @ts-ignore
        onLayout={() => setLength(ref.current?.getTotalLength())}
        fill='none'
        strokeDasharray={length}
        {...{ d, strokeWidth, stroke }}
        animatedProps={bgAnimatedProps}
      />
      <AnimatedPath
        stroke='#ccc'
        fill='none'
        strokeDasharray={length}
        {...{ d, strokeWidth, animatedProps }}
      />
    </>
  );
};

export default AnimatedStroke;

type Props = {
  d: string;
  strokeWidth: number;
  progress: SharedValue<number>;
  bgProgress: SharedValue<number>;
};
