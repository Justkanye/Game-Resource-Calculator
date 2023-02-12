import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, FlatList, Alert } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";
import * as Linking from "expo-linking";
import { getDocumentAsync } from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { useStore } from "../hooks";
import { Game, RootStackParamList } from "../types";
import { Title } from "../utils";
import { getError } from "../helpers";
import { gameSchema } from "../constants";

const Games = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [games, addGame] = useStore(s => [s.games, s.addGame]);
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
      marginHorizontal: "5%",
    },
    emptyText: {
      textAlign: "center",
      color: colors.placeholder,
      marginBottom: 100,
    },
    cardContainer: {
      width: "100%",
      justifyContent: "center",
      flexDirection: "row",
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

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Title title='Games' />
          <Button
            mode='contained'
            onPress={importGame}
            children={"Import"}
            style={{
              marginBottom: 10,
            }}
          />
        </>
      }
      data={games}
      renderItem={({ item }) => (
        <Card
          onPress={() => {
            Linking.openURL(`rsscalc://app/game/${item.id}`).catch(e => {
              console.log(getError(e));
              alert(getError(e));
              navigation.navigate("Game", {
                gameId: item.id,
              });
            });
          }}
        >
          <Card.Title title={item.name} />
        </Card>
      )}
    />
  );
};

export default Games;
