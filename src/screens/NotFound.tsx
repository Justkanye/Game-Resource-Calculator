import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import { Button, Title } from "react-native-paper";

import { RootStackParamList } from "../types";

const NotFound = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View>
      <Title>This screen does not exist!</Title>
      <Button
        style={{ margin: 20 }}
        mode='contained'
        onPress={() => navigation.navigate("Main")}
      >
        Go home
      </Button>
    </View>
  );
};

export default NotFound;
