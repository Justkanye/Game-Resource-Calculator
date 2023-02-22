import { StackScreenProps } from "@react-navigation/stack";
import { FC, useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { Button } from "react-native-paper";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { OnboardingItem, OnboardingPaginator } from "../components";
import { ONBOARDING_DATA as data } from "../constants";
import { useSettings } from "../hooks";
import { OnboardingItemType, RootStackParamList } from "../types";

type Props = StackScreenProps<RootStackParamList, "Onboarding">;
const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<OnboardingItemType>>(FlatList);

const Onboarding: FC<Props> = ({ navigation }) => {
  const setHasOnboarded = useSettings(s => s.setHasOnboarded);
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) =>
      setCurrentIndex(viewableItems[0].index ?? 0)
  ).current;
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const ref = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(({ contentOffset: { x } }) => {
    scrollX.value = x;
  });
  const next = () => {
    if (currentIndex < data.length - 1)
      ref.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    else onboard();
  };
  const onboard = () => {
    setHasOnboarded(true);
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <AnimatedFlatList
          {...{
            data,
            bounces: false,
            onViewableItemsChanged,
            viewabilityConfig,
            ref,
            showsHorizontalScrollIndicator: false,
            scrollEventThrottle: 32,
            onScroll,
          }}
          renderItem={({ item }) => <OnboardingItem {...item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
      </View>
      <OnboardingPaginator {...{ data, scrollX }} />
      <Button
        children={"Next"}
        onPress={next}
        mode='contained'
        style={styles.button}
      />
      <Button children={"Skip"} onPress={onboard} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
});
