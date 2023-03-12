import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { OnboardingItem, OnboardingPaginator } from "../components";
import { ONBOARDING_DATA as data, ONBOARDING_STATE_KEY } from "../constants";
import { OnboardingItemType, OnboardingState } from "../types";

const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<OnboardingItemType>>(FlatList);

const Onboarding: FC<Props> = ({ setOnboardingState, onboardingState }) => {
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) =>
      AsyncStorage.mergeItem(
        ONBOARDING_STATE_KEY,
        JSON.stringify({ currentIndex: viewableItems[0].index ?? 0 }),
        err => {
          if (err) console.log({ err });
          setOnboardingState(state => ({
            ...state,
            currentIndex: viewableItems[0].index ?? 0,
          }));
        }
      )
  ).current;
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const ref = useRef<FlatList>(null);
  const { width, height } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(({ contentOffset: { x } }) => {
    scrollX.value = x;
  });
  const { colors } = useTheme();
  const next = () => {
    if (onboardingState.currentIndex < data.length - 1)
      ref.current?.scrollToIndex({
        index: onboardingState.currentIndex + 1,
        animated: true,
      });
    else onboard();
  };
  const onboard = () => {
    const state = { currentIndex: data.length - 1, hasOnboarded: true };
    AsyncStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(state), err => {
      if (err) console.log(err);
      setOnboardingState(state);
    });
  };

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
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
          initialScrollIndex={onboardingState.currentIndex}
        />
      </View>
      <OnboardingPaginator {...{ data, scrollX }} />
      <View style={width > height ? styles.row : null}>
        <Button
          children={
            onboardingState.currentIndex === data.length - 1
              ? "Get Started"
              : "Next"
          }
          onPress={next}
          mode='contained'
          style={{ ...styles.button, width: width * 0.6 }}
        />
        <Button children={"Skip"} onPress={onboard} />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

type Props = {
  setOnboardingState: Dispatch<SetStateAction<OnboardingState>>;
  onboardingState: OnboardingState;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
