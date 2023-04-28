import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FieldArray, Formik } from "formik";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Portal,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";

import { Error } from "../components/FormElements";
import { addGameInitialValues, addGameValidationSchema } from "../constants";
import { randomUUID } from "../helpers";
import { useStore } from "../hooks";
import { Game, RootStackParamList } from "../types";
import { Icon, Title as MyTitle } from "../utils";

const Add = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const addGame = useStore(s => s.addGame);
  const [currentRssIndex, setCurrentRssIndex] = useState(0);
  const [currentRssPackIndex, setCurrentRssPackIndex] = useState(0);
  const [rssModalOpen, setRssModalOpen] = useState(false);
  const [rssPackModalOpen, setRssPackModalOpen] = useState(false);
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
    button: {
      margin: 10,
    },
    row: {
      justifyContent: "flex-end",
      alignItems: "center",
      flexDirection: "row",
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

  return (
    <ScrollView style={styles.container}>
      <MyTitle title='Add new Game' />
      <Formik
        initialValues={addGameInitialValues}
        validationSchema={addGameValidationSchema}
        onSubmit={values => {
          const game: Game = {
            ...values,
            id: values.name.toLowerCase().trim().split(" ").join("-"),
          };
          addGame(game);
          navigation.replace("Main", {
            screen: "Games",
          });
        }}
      >
        {({
          handleBlur,
          touched,
          values,
          errors,
          handleChange,
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
                    style={{ textAlign: "center", textTransform: "capitalize" }}
                  >
                    {name}
                  </Title>
                  {values.resources?.map((rss, i) => (
                    <View
                      key={randomUUID()}
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
                    </View>
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
                            touched.resources?.[currentRssIndex]?.packs?.some(
                              v => v
                            ) &&
                            //@ts-ignore
                            errors.resources?.[currentRssIndex]?.packs
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
                        color='#000'
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
            >
              Add
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Add;
