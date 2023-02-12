import { StackScreenProps } from "@react-navigation/stack";
import { FC, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, List, Text, TextInput, useTheme } from "react-native-paper";
import {
  cacheDirectory,
  documentDirectory,
  writeAsStringAsync,
} from "expo-file-system";
import * as Sharing from "expo-sharing";

import { optimizeCount } from "../helpers";
import { useStore } from "../hooks";
import { RootStackParamList } from "../types";
import { Icon, Title } from "../utils";

type Props = StackScreenProps<RootStackParamList, "Game">;

const Game: FC<Props> = ({
  route: {
    params: { gameId },
  },
  navigation,
}) => {
  const { colors } = useTheme();
  const [game, addGame, deleteGame] = useStore(s => [
    s.games.find(g => g.id === gameId),
    s.addGame,
    s.deleteGame,
  ]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 5,
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

  const confirmDelete = () =>
    Alert.alert(
      "Delete game?",
      `Please confirm your request to delete "${game?.name}"`,
      [
        {
          text: "Confirm",
          onPress: () => deleteGame(gameId),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );

  useLayoutEffect(() => {
    if (game?.name)
      navigation.setOptions({
        title: game.name,
        headerRight: ({ tintColor, pressOpacity }) => (
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={pressOpacity}
              onPress={() =>
                navigation.navigate("Edit", {
                  gameId,
                })
              }
            >
              <Icon
                color={tintColor}
                iconComponentName='Feather'
                iconName='edit'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              activeOpacity={pressOpacity}
              onPress={confirmDelete}
            >
              <Icon color={colors.error} iconName='trash' />
            </TouchableOpacity>
          </View>
        ),
      });
  }, [game?.name]);

  return (
    <ScrollView style={styles.container}>
      {game ? (
        <View>
          <Title title={game.name} />
          <Button
            mode='contained'
            onPress={() => {
              const fileUri = cacheDirectory + game.name + ".json";
              console.log({ cacheDirectory, documentDirectory });
              writeAsStringAsync(fileUri, JSON.stringify(game), {
                encoding: "utf8",
              }).then(() =>
                Sharing.shareAsync(fileUri, {
                  dialogTitle: `Export ${game.name}`,
                  mimeType: "application/json",
                })
              );
            }}
            children={"Export"}
          />
          <View style={styles.row}>
            {game.resources?.map(rss => {
              const val = rss.packs.reduce(
                (prev, pack) => prev + (pack.quantity ?? 0) * (pack.value ?? 0),
                0
              );
              return (
                <Text key={rss.name} style={styles.rssVal}>
                  {rss.name}: {optimizeCount(val)}
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