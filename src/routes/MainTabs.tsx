import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from "@react-navigation/material-bottom-tabs";
import { useTheme } from "react-native-paper";

import { Games, Add, Settings } from "../screens";
import { Icon } from "../utils";
import { MainTabParamList } from "../types";

const MainTab = createMaterialBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { colors } = useTheme();

  const screenOptions = ({
    route,
  }: ScreenOptionsProps): MaterialBottomTabNavigationOptions => ({
    tabBarIcon: ({ color = colors.accent }) => {
      let iconName = "game-controller";
      let iconComponentName;
      switch (route.name) {
        case "Add":
          iconName = "add-circle";
          break;
        case "Settings":
          iconName = "settings";
          break;
        default:
          break;
      }

      return (
        <Icon
          iconName={iconName}
          color={color}
          size={25}
          iconComponentName={iconComponentName}
          onPress={() => console.log("pressed")}
        />
      );
    },
  });

  return (
    <MainTab.Navigator
      initialRouteName='Games'
      // screenListeners={{
      //   tabPress: ({ target }) => {
      //     console.log({ target });
      //   },
      // }}
      screenOptions={screenOptions}
    >
      <MainTab.Screen name='Games' component={Games} />
      <MainTab.Screen name='Add' component={Add} />
      <MainTab.Screen name='Settings' component={Settings} />
    </MainTab.Navigator>
  );
};

export default MainTabs;

type ScreenOptionsProps = {
  route: RouteProp<ParamListBase, string>;
  navigation: any;
};
