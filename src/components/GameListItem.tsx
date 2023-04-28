import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Title, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Game, RootStackParamList } from "../types";

const GameListItem: FC<Game> = ({ id, name }) => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Main">>();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    avatar: {
      borderRadius: 10,
      marginRight: 5,
      backgroundColor: colors.accent,
    },
  });

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Game", {
          gameId: id,
        })
      }
      style={styles.container}
    >
      <Avatar.Text
        size={40}
        label={name.charAt(0)}
        style={styles.avatar}
        color='#fff'
      />
      <Title>{name}</Title>
    </TouchableOpacity>
  );
};

export default GameListItem;
