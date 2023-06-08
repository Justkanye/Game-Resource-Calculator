import { ParamListBase, RouteProp } from "@react-navigation/native";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from "@react-navigation/material-bottom-tabs";

import { Games, Add, Settings } from "../screens";
import { MainTabParamList } from "../types";
import { AnimatedTabBarIcon } from "../components";
import { useState } from "react";

const MainTab = createMaterialBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const [current, setCurrent] = useState<string>();

  const screenOptions = ({
    route,
  }: ScreenOptionsProps): MaterialBottomTabNavigationOptions => ({
    tabBarIcon: ({ color }) => {
      let iconName = "game-controller";
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
        <AnimatedTabBarIcon
          iconProps={{ color, iconName, size: 25 }}
          animate={current === route.name}
          rotate={route.name !== "Games"}
        />
      );
    },
  });

  return (
    <MainTab.Navigator
      initialRouteName='Games'
      screenListeners={{
        tabPress: ({ target }) => {
          setCurrent(target?.split("-")[0]);
        },
      }}
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
