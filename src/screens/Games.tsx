import { StyleSheet, Alert, TouchableOpacity, View } from "react-native";
import { useTheme, Divider, AnimatedFAB } from "react-native-paper";
import { getDocumentAsync } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SwipeListView } from "react-native-swipe-list-view";
import { StackScreenProps } from "@react-navigation/stack";
import { CompositeScreenProps } from "@react-navigation/native";
import { MaterialBottomTabScreenProps } from "@react-navigation/material-bottom-tabs";

import { useStore } from "../hooks";
import { Game, RootStackParamList, MainTabParamList } from "../types";
import { Icon, ListEmptyComponent, Title } from "../utils";
import { gameSchema } from "../constants";
import { GameListItem } from "../components";

type Props = CompositeScreenProps<
  StackScreenProps<RootStackParamList, "Main">,
  MaterialBottomTabScreenProps<MainTabParamList, "Games">
>;

const Games = ({ navigation }: Props) => {
  const { colors, roundness } = useTheme();
  const [games, addGame, deleteGame] = useStore(s => [
    s.games,
    s.addGame,
    s.deleteGame,
  ]);
  const styles = StyleSheet.create({
    container: {
      // paddingHorizontal: 5,
      flex: 1,
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
    fabContainer: {
      width: "97%",
      height: 70,
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginBottom: "3%",
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
    <>
      <SwipeListView
        contentContainerStyle={styles.container}
        ListHeaderComponent={<Title title='Games' />}
        data={games}
        renderItem={({ item }) => <GameListItem {...item} />}
        ItemSeparatorComponent={() => <Divider />}
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
        ListEmptyComponent={
          <ListEmptyComponent
            iconComponentName='Entypo'
            iconName='game-controller'
            itemName='games'
            button={{
              label: "Add a game",
              onPress: () =>
                navigation.navigate("Main", {
                  screen: "Add",
                }),
            }}
          />
        }
      />
      <View style={styles.fabContainer}>
        <AnimatedFAB
          icon='file-import'
          label='Import'
          onPress={importGame}
          extended
          visible
          color='#fff'
        />
      </View>
    </>
  );
};

export default Games;
