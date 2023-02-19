import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

import { RootStackParamList } from "../types";

const NotFound = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View>
      <Text>This screen does not exist!</Text>
      <Button
        style={{ margin: 20 }}
        mode='contained'
        onPress={() => navigation.navigate("Main", {})}
      >
        Go home
      </Button>
      <Button
        style={{ margin: 20 }}
        mode='contained'
        onPress={() => navigation.goBack()}
      >
        Go Back
      </Button>
    </View>
  );
};

export default NotFound;
