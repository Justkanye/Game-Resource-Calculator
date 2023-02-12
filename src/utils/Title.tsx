import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const Title = ({ title = "Gemwares" }) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      textAlign: "center",
      textTransform: "capitalize",
      fontWeight: "bold",
      marginTop: 10,
    },
    divider: {
      marginHorizontal: 10,
      flex: 1,
      height: 2,
      backgroundColor: colors.disabled,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
  return (
    <View style={styles.row}>
      <View style={styles.divider} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
    </View>
  );
};

export default Title;
