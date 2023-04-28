import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Title, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Linking from "expo-linking";

import { prefix } from "../constants";
import { getError } from "../helpers";
import { Game, RootStackParamList } from "../types";
import Color from "color";

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
      onPress={() => {
        Linking.openURL(`${prefix}game/${id}`).catch(e => {
          console.log(getError(e));
          alert(getError(e));
          navigation.navigate("Game", {
            gameId: id,
          });
        });
      }}
      style={styles.container}
    >
      <Avatar.Text
        size={40}
        label={name.charAt(0)}
        color={Color(colors.accent).darken(0.3).hex()}
        style={styles.avatar}
      />
      <Title>{name}</Title>
    </TouchableOpacity>
  );
};

export default GameListItem;
