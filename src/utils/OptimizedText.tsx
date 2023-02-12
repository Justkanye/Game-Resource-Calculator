import { Text, useTheme } from "react-native-paper";
import { useCallback, useState } from "react";
import {
  NativeSyntheticEvent,
  Platform,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from "react-native";

const OptimizedText = ({
  content = "",
  numberOfLines = 2,
  style = {},
  containerStyle = {},
  linkStyle = {},
}) => {
  const { colors } = useTheme();
  const [num, setNum] = useState(numberOfLines);
  const [hasMore, setHasMore] = useState(false);

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const {
        nativeEvent: { lines },
      } = e;
      setHasMore(
        Platform.OS === "ios"
          ? lines.length >= numberOfLines
          : lines.length > numberOfLines
      );
    },
    [numberOfLines]
  );

  return (
    <View style={containerStyle}>
      <Text onTextLayout={onTextLayout} numberOfLines={num} style={style}>
        {content?.trim()}
      </Text>
      {hasMore && (
        <TouchableOpacity
          onPress={() => setNum(prev => (prev ? 0 : numberOfLines))}
          activeOpacity={0.5}
        >
          <Text
            style={[
              {
                color: colors.accent,
              },
              linkStyle,
            ]}
          >
            show {num ? "more" : "less"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OptimizedText;
