import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useTheme, Divider, AnimatedFAB } from "react-native-paper";
import { getDocumentAsync } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SwipeListView } from "react-native-swipe-list-view";

import { useStore } from "../hooks";
import { Game } from "../types";
import { Icon, Title } from "../utils";
import { gameSchema } from "../constants";
import { GameListItem } from "../components";

const Games = () => {
  const { colors, roundness } = useTheme();
  const [games, addGame, deleteGame] = useStore(s => [
    s.games,
    s.addGame,
    s.deleteGame,
  ]);
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 5,
    },
    divider: {
      backgroundColor: colors.disabled,
    },
    delete: {
      alignSelf: "flex-end",
      backgroundColor: colors.error,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      borderTopRightRadius: roundness,
      borderBottomRightRadius: roundness,
      aspectRatio: 1,
    },
  });

  const importGame = () =>
    getDocumentAsync({
      copyToCacheDirectory: true,
      type: ["application/json", "*.json", "*/json"],
    }).then(res => {
      // console.log(res);
      if (res.type === "success")
        FileSystem.readAsStringAsync(res.uri, {
          encoding: "utf8",
        }).then(val => {
          // console.log(val);
          const data: Game | undefined = JSON.parse(val);
          gameSchema
            .isValid(data)
            .then(isValid => {
              if (isValid && data) {
                if (games.findIndex(g => g.id === data.id) < 0) addGame(data);
                else
                  Alert.alert(
                    "Replace game?",
                    `"${data.name}" already exists. Would you like to overwrite it?`,
                    [
                      {
                        text: "Yes",
                        onPress: () => addGame(data),
                      },
                      {
                        text: "No",
                        style: "cancel",
                      },
                    ]
                  );
              } else {
                alert("File content is not compatible with our data format.");
              }
            })
            .catch(err => console.log({ err }));
        });
    });

  const confirmDelete = (game: Game) => {
    Alert.alert(
      "Delete game?",
      `Please confirm your request to delete "${game.name}"`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => deleteGame(game.id),
        },
      ]
    );
  };

  return (
    <SwipeListView
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Title title='Games' />}
      data={games}
      renderItem={({ item }) => <GameListItem {...item} />}
      ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      renderHiddenItem={({ item }) => (
        <TouchableOpacity
          style={styles.delete}
          onPress={() => confirmDelete(item)}
        >
          <Icon
            color='#fff'
            iconName='delete'
            iconComponentName='MaterialCommunityIcons'
          />
        </TouchableOpacity>
      )}
      rightOpenValue={-50}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      ListFooterComponent={
        <AnimatedFAB
          icon='file-import'
          label='Import'
          onPress={importGame}
          extended
        />
      }
    />
  );
};

export default Games;

/* <Button
    mode='contained'
    onPress={importGame}
    children={"Import"}
    style={{
      margin: 10,
    }}
    icon='file-import'
  /> */
