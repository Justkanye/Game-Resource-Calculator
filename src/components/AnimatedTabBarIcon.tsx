import { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Icon, { IconProps } from "../utils/Icon";

const AnimatedTabBarIcon = ({ iconProps, animate, rotate }: Props) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(
    () => ({
      transform: [
        { scale: scale.value },
        {
          rotate: `${
            rotate
              ? Math.floor(interpolate(scale.value, [1, 1.5], [0, 180]))
              : 0
          }deg`,
        },
      ],
    }),
    [scale, rotate]
  );

  const animateScale = (from = rotate ? 1.3 : 1.5, to = 1) => {
    scale.value = withSpring(from, undefined, isFinished => {
      if (isFinished) scale.value = withSpring(to);
    });
  };

  useEffect(() => {
    if (animate) animateScale();
  }, [animate]);

  return (
    <Animated.View {...{ style }}>
      <Icon {...iconProps} />
    </Animated.View>
  );
};

export default AnimatedTabBarIcon;

type Props = {
  iconProps: IconProps;
  animate: boolean;
  rotate?: boolean;
};
