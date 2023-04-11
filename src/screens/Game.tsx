import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { List, Menu, Text, TextInput } from "react-native-paper";
import {
  cacheDirectory,
  writeAsStringAsync,
  StorageAccessFramework,
} from "expo-file-system";
import { shareAsync } from "expo-sharing";

import { getError, optimizeCount, schedulePushNotification } from "../helpers";
import { useStore } from "../hooks";
import { RootStackParamList } from "../types";
import { Icon } from "../utils";
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

  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
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
    rssVal: {
      marginRight: 10,
    },
  });

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
            <Menu.Item
              title='Edit'
              icon='notebook-edit'
              onPress={() => {
                setVisible(false);
                navigation.navigate("Edit", {
                  gameId,
                });
              }}
            />
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

  return (
    <ScrollView style={styles.container}>
      {game ? (
        <View>
          {/* <Title title={game.name} /> */}
          <View style={styles.row}>
            {game.resources?.map((rss, i, arr) => {
              const val = rss.packs.reduce(
                (prev, pack) => prev + (pack.quantity ?? 0) * (pack.value ?? 0),
                0
              );
              return (
                <Text key={rss.name} style={styles.rssVal}>
                  {rss.name}: {optimizeCount(val)}
                  {i !== arr.length - 1 && ","}
                </Text>
              );
            })}
          </View>
          <List.AccordionGroup>
            {game.resources?.map((rss, rssIndex) => (
              <List.Accordion title={rss.name} id={rss.name} key={rssIndex}>
                {rss.packs.map((rssPack, packIndex) => (
                  <TextInput
                    key={packIndex}
                    label={`${rssPack.name} quantity`}
                    value={rssPack.quantity?.toString()}
                    onChangeText={text => {
                      let newGame = game;
                      const number = parseFloat(text);
                      game.resources[rssIndex].packs[packIndex].quantity =
                        (number > 0 ? number : 0) ?? 0;
                      addGame(newGame);
                    }}
                    keyboardType='number-pad'
                  />
                ))}
                {!rss.packs?.length && <Text>No resource packs yet.</Text>}
              </List.Accordion>
            ))}
          </List.AccordionGroup>
          {!game.resources?.length && <Text>No game resources yet.</Text>}
        </View>
      ) : (
        <Text style={styles.title}>Can&apos;t find this game</Text>
      )}
    </ScrollView>
  );
};

export default Game;
