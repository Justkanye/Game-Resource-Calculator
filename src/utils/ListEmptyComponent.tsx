import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import Icon from "./Icon";

const ListEmptyComponent = ({
  iconName = "package-variant",
  iconComponentName = "MaterialCommunityIcons",
  itemName = "game resources",
  emptyText = `No ${itemName} yet...`,
  button,
}: Props) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Icon
        {...{ iconName, iconComponentName }}
        size={100}
        color={colors.onSurface}
      />
      <Text style={styles.text}>{emptyText}</Text>
      {!!button && (
        <Button mode='contained' style={styles.button} onPress={button.onPress}>
          {button.label}
        </Button>
      )}
    </View>
  );
};

export default ListEmptyComponent;

type Props = {
  iconName?: string;
  iconComponentName?: string;
  emptyText?: string;
  itemName?: string;
  button?: {
    label: string;
    onPress: () => void;
  };
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: "auto",
  },
  text: {
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 15,
  },
  button: {
    marginTop: 10,
  },
});
