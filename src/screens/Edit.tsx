import { StackScreenProps } from "@react-navigation/stack";
import { FieldArray, Formik } from "formik";
import { FC, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  useTheme,
  Title,
  Button,
  Portal,
  Modal,
  Card,
} from "react-native-paper";
import Animated from "react-native-reanimated";

import { Error } from "../components";
import { addGameValidationSchema } from "../constants";
import { randomUUID } from "../helpers";
import { useStore } from "../hooks";
import { RootStackParamList } from "../types";
import { Icon } from "../utils";

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
  const [currentRssIndex, setCurrentRssIndex] = useState(0);
  const [currentRssPackIndex, setCurrentRssPackIndex] = useState(0);
  const [rssModalOpen, setRssModalOpen] = useState(false);
  const [rssPackModalOpen, setRssPackModalOpen] = useState(false);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
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
    button: {
      margin: 10,
    },
    link: {
      color: colors.accent,
    },
    errCon: {
      borderColor: colors.error,
    },
    arcCon: {
      justifyContent: "space-between",
      borderColor: colors.backdrop,
      borderWidth: 2,
      borderRadius: 6,
      padding: 3,
      marginBottom: 5,
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
        title: "Edit Game",
        headerRight: ({ pressOpacity }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              activeOpacity={pressOpacity}
              onPress={confirmDelete}
            >
              <Icon color={colors.error} iconName='trash' />
            </TouchableOpacity>
          </View>
        ),
        headerTitleAlign: "center",
      });
  }, [game?.name]);

  return (
    <ScrollView style={styles.container}>
      {game ? (
        <Formik
          onSubmit={values => {
            addGame(values);
            navigation.goBack();
          }}
          initialValues={game}
          validationSchema={addGameValidationSchema}
        >
          {({
            values,
            handleBlur,
            handleChange,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <View style={{ marginTop: 15 }}>
              <TextInput
                label='Name'
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={!!touched.name && !!errors.name}
                placeholder='The name of the game'
              />
              <Error error={errors.name} touched={touched.name} />

              <FieldArray
                name='resources'
                validateOnChange
                render={({ name, remove, push }) => (
                  <>
                    <Title
                      style={{
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    >
                      {name}
                    </Title>
                    {values.resources?.map((rss, i) => (
                      <Animated.View
                        key={randomUUID()}
                        // entering={FadeInDown}
                        // exiting={FadeInUp}
                        style={[
                          styles.row,
                          styles.arcCon,
                          (touched.resources?.[i] ||
                            touched.resources?.[i]?.name ||
                            touched.resources?.[i]?.packs) &&
                          !!errors.resources?.[i]
                            ? styles.errCon
                            : undefined,
                        ]}
                      >
                        <Text>
                          {rss.name || "No name provided"} (
                          {rss.packs?.length ?? 0} packs)
                        </Text>
                        <View style={styles.row}>
                          <Button
                            mode='contained'
                            onPress={() => {
                              setCurrentRssIndex(i);
                              setRssModalOpen(true);
                            }}
                          >
                            <Icon
                              iconComponentName='Feather'
                              color='#fff'
                              iconName='edit'
                            />
                          </Button>
                          <Button
                            mode='contained'
                            color={colors.error}
                            style={{ marginLeft: 5 }}
                            onPress={() => remove(i)}
                          >
                            <Icon iconName='trash' color='#fff' />
                          </Button>
                        </View>
                      </Animated.View>
                    ))}
                    <Button
                      style={{ marginVertical: 10 }}
                      onPress={() => push({ name: "", packs: [] })}
                    >
                      Add Resource
                    </Button>
                  </>
                )}
              />
              <Portal>
                <Modal
                  visible={rssModalOpen}
                  onDismiss={() => {
                    setRssModalOpen(false);
                    setFieldTouched(`resources[${currentRssIndex}].name`, true);
                  }}
                >
                  <Card style={{ padding: 10 }}>
                    <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setRssModalOpen(false);
                          setFieldTouched(
                            `resources[${currentRssIndex}].name`,
                            true
                          );
                        }}
                      >
                        <Icon
                          iconName='close'
                          color={colors.text}
                          iconComponentName='FontAwesome'
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      label='Name'
                      value={values.resources?.[currentRssIndex]?.name}
                      onChangeText={handleChange(
                        `resources[${currentRssIndex}].name`
                      )}
                      onBlur={handleBlur(`resources[${currentRssIndex}].name`)}
                      error={
                        !!touched.resources?.[currentRssIndex]?.name &&
                        //@ts-ignore
                        !!errors.resources?.[currentRssIndex]?.name
                      }
                      placeholder='The name of the resource'
                    />
                    <Error
                      //@ts-ignore
                      error={errors.resources?.[currentRssIndex]?.name}
                      touched={touched.resources?.[currentRssIndex]?.name}
                    />

                    <>
                      <Title
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Resource Packs
                      </Title>
                      {values.resources?.[currentRssIndex]?.packs?.map(
                        (pack, i) => (
                          <View
                            key={randomUUID()}
                            style={[
                              styles.row,
                              styles.arcCon,
                              !!(
                                touched.resources?.[currentRssIndex]?.packs?.[i]
                                  ?.name ||
                                touched.resources?.[currentRssIndex]?.packs?.[i]
                                  ?.value
                              ) &&
                              //@ts-ignore
                              !!errors.resources?.[currentRssIndex]?.packs?.[i]
                                ? styles.errCon
                                : undefined,
                            ]}
                          >
                            <Text>{pack.name || "No name provided"}</Text>
                            <View style={styles.row}>
                              <Button
                                mode='contained'
                                onPress={() => {
                                  setCurrentRssPackIndex(i);
                                  setRssPackModalOpen(true);
                                }}
                              >
                                <Icon
                                  iconComponentName='Feather'
                                  color='#fff'
                                  iconName='edit'
                                />
                              </Button>
                              <Button
                                mode='contained'
                                color={colors.error}
                                style={{ marginLeft: 5 }}
                                onPress={() =>
                                  setFieldValue(
                                    `resources[${currentRssIndex}].packs`,
                                    values.resources?.[
                                      currentRssIndex
                                    ]?.packs?.filter((_, index) => i !== index)
                                  )
                                }
                              >
                                <Icon color='#fff' iconName='trash' />
                              </Button>
                            </View>
                          </View>
                        )
                      )}
                      <Button
                        style={{ marginVertical: 10 }}
                        onPress={() =>
                          setFieldValue(`resources[${currentRssIndex}].packs`, [
                            ...values.resources?.[currentRssIndex]?.packs,
                            { name: "", packs: [] },
                          ])
                        }
                      >
                        Add Resource
                      </Button>
                    </>
                  </Card>
                </Modal>
                <Modal
                  visible={rssPackModalOpen}
                  onDismiss={() => setRssPackModalOpen(false)}
                  style={{ zIndex: 5 }}
                >
                  <Card style={{ padding: 10 }}>
                    <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => setRssPackModalOpen(false)}
                      >
                        <Icon
                          iconName='close'
                          color={colors.text}
                          iconComponentName='FontAwesome'
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      label='Name'
                      value={
                        values.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name
                      }
                      onChangeText={handleChange(
                        `resources[${currentRssIndex}].packs[${currentRssPackIndex}].name`
                      )}
                      onBlur={handleBlur(
                        `resources[${currentRssIndex}].packs[${currentRssPackIndex}].name`
                      )}
                      error={
                        !!touched.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name &&
                        //@ts-ignore
                        !!errors.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name
                      }
                      placeholder='The name of the resource pack'
                    />
                    <Error
                      error={
                        //@ts-ignore
                        errors.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name
                      }
                      touched={
                        touched.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name
                      }
                    />
                    <View style={{ height: 10 }} />
                    <TextInput
                      label='Value'
                      value={values.resources?.[currentRssIndex]?.packs?.[
                        currentRssPackIndex
                      ]?.value?.toString()}
                      onChangeText={text =>
                        setFieldValue(
                          `resources[${currentRssIndex}].packs[${currentRssPackIndex}].value`,
                          parseFloat(text)
                        )
                      }
                      onBlur={handleBlur(
                        `resources[${currentRssIndex}].packs[${currentRssPackIndex}].value`
                      )}
                      error={
                        !!touched.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.value &&
                        //@ts-ignore
                        !!errors.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.name
                      }
                      placeholder='The value of the resource pack'
                      keyboardType='number-pad'
                    />
                    <Error
                      error={
                        //@ts-ignore
                        errors.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.value
                      }
                      touched={
                        touched.resources?.[currentRssIndex]?.packs?.[
                          currentRssPackIndex
                        ]?.value
                      }
                    />
                  </Card>
                </Modal>
              </Portal>

              <Button
                style={styles.button}
                mode='contained'
                onPress={handleSubmit}
                children='Update'
              />
            </View>
          )}
        </Formik>
      ) : (
        <Text style={styles.title}>Can&apos;t find this game</Text>
      )}
    </ScrollView>
  );
};

export default Game;
