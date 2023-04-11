import * as Icons from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";
import { useTheme } from "react-native-paper";

// const Icons = {
//   Entypo,
//   Feather,
//   FontAwesome,
//   FontAwesome5,
//   Ionicons,
//   MaterialCommunityIcons,
//   MaterialIcons,
// };

const Icon = ({
  iconComponentName = "Ionicons",
  iconName = "arrow-back",
  color,
  size = 20,
  onPress,
  isTest,
  style,
  onLongPress,
}: Props) => {
  const { colors } = useTheme();
  //@ts-ignore
  const Icon = Icons[iconComponentName];
  if (isTest)
    return (
      <Icons.MaterialCommunityIcons
        name='bell'
        size={size}
        color={color ?? colors.accent}
        style={style}
      />
    );
  return (
    <Icon
      name={iconName}
      color={color ?? colors.accent}
      size={size}
      onPress={onPress}
      onLongPress={onLongPress}
      style={style}
    />
  );
};

export default Icon;

type Props = {
  iconComponentName?: string;
  iconName?: string;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  isTest?: boolean;
};
