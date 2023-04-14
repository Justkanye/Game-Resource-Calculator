import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  View,
} from "react-native";
import { Divider, List, Menu, Text, TextInput } from "react-native-paper";
import {
  cacheDirectory,
  writeAsStringAsync,
  StorageAccessFramework,
} from "expo-file-system";
import { shareAsync } from "expo-sharing";

import { getError, optimizeCount, schedulePushNotification } from "../helpers";
import { useStore } from "../hooks";
import { RootStackParamList } from "../types";
import { Icon, ListEmptyComponent } from "../utils";
import { prefix } from "../constants";

type Props = StackScreenProps<RootStackParamList, "Game">;

const Game: FC<Props> = ({
  route: {
    params: { gameId },
  },
  navigation,
}) => {
  const [game, addGame, deleteGame] = useStore(s => [
    s.games.find(g => g.id === gameId),
    s.addGame,
    s.deleteGame,
  ]);
  const [visible, setVisible] = useState(false);

  const confirmDelete = () => {
    setVisible(false);
    Alert.alert(
      "Delete game?",
      `Please confirm your request to delete "${game?.name}"`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => deleteGame(gameId),
        },
      ]
    );
  };

  const saveGame = async () => {
    setVisible(false);
    const permission =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permission.granted || !game) return;
    const uri = await StorageAccessFramework.createFileAsync(
      permission.directoryUri,
      game.name + ".json",
      "application/json"
    ).catch(e => alert(getError(e)));
    if (!uri) return;
    writeAsStringAsync(uri, JSON.stringify(game), {
      encoding: "utf8",
    })
      .then(() => alert("File saved successfully"))
      .catch(e => alert(getError(e)));
  };

  const shareGame = () => {
    setVisible(false);
    if (!game) return;
    const fileUri = cacheDirectory + game.name + ".json";
    writeAsStringAsync(fileUri, JSON.stringify(game), {
      encoding: "utf8",
    }).then(() =>
      shareAsync(fileUri, {
        dialogTitle: `Share ${game.name}`,
        mimeType: "application/json",
      })
    );
  };

  const sendNotification = () => {
    setVisible(false);
    if (game)
      schedulePushNotification({
        content: {
          title: game.name,
          body: `Open ${game.name} from notification`,
          data: {
            deepLink: `${prefix}game/${game.id}`,
          },
          badge: 1,
          autoDismiss: false,
        },
        trigger: { seconds: 10 },
      });
  };

  const editGame = () => {
    setVisible(false);
    navigation.navigate("Edit", {
      gameId,
    });
  };

  useLayoutEffect(() => {
    if (game?.name)
      navigation.setOptions({
        title: game.name,
        headerRight: ({ tintColor, pressOpacity }) => (
          <Menu
            {...{ visible }}
            onDismiss={() => setVisible(false)}
            anchor={
              <TouchableOpacity
                activeOpacity={pressOpacity}
                onPress={() => setVisible(true)}
                style={{
                  marginRight: 10,
                }}
              >
                <Icon
                  color={tintColor}
                  iconComponentName='Feather'
                  iconName='more-vertical'
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item title='Save' icon='content-save' onPress={saveGame} />
            <Menu.Item title='Share' icon='share-variant' onPress={shareGame} />
            <Menu.Item title='Edit' icon='notebook-edit' onPress={editGame} />
            <Menu.Item title='Delete' icon='delete' onPress={confirmDelete} />
            <Menu.Item
              title='Get Reminder'
              icon='bell-ring'
              onPress={sendNotification}
            />
          </Menu>
        ),
      });
  }, [game?.name, visible]);

  return game ? (
    <List.AccordionGroup>
      <FlatList
        contentContainerStyle={{
          flex: 1,
        }}
        data={game.resources}
        keyExtractor={rss => rss.name}
        renderItem={({ item, index }) => (
          <List.Accordion
            title={item.name}
            id={item.name}
            description={optimizeCount(
              item.packs.reduce(
                (prev, pack) => prev + (pack.quantity ?? 0) * (pack.value ?? 0),
                0
              )
            )}
          >
            <FlatList
              data={item.packs}
              renderItem={({ index: packIndex, item }) => (
                <TextInput
                  key={packIndex}
                  label={`${item.name} quantity`}
                  value={item.quantity?.toString()}
                  onChangeText={text => {
                    let newGame = game;
                    const number = parseFloat(text);
                    game.resources[index].packs[packIndex].quantity =
                      (number > 0 ? number : 0) ?? 0;
                    addGame(newGame);
                  }}
                  keyboardType='number-pad'
                />
              )}
              ListEmptyComponent={
                <View
                  style={{
                    width: "100%",
                    height: 200,
                  }}
                >
                  <ListEmptyComponent
                    iconComponentName='Ionicons'
                    iconName='layers'
                    itemName={`resource packs for ${item.name.toLowerCase()}`}
                    button={{
                      label: "Add a resource pack",
                      onPress: editGame,
                    }}
                  />
                </View>
              }
            />
          </List.Accordion>
        )}
        ListEmptyComponent={
          <ListEmptyComponent
            button={{
              label: "Add a resource",
              onPress: editGame,
            }}
          />
        }
        ItemSeparatorComponent={() => <Divider />}
      />
    </List.AccordionGroup>
  ) : (
    <Text style={styles.title}>Can&apos;t find this game</Text>
  );
};

export default Game;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: "center",
    textTransform: "capitalize",
    fontWeight: "bold",
    marginTop: 10,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
