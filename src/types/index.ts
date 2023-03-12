import { FC } from "react";
import { SvgProps } from "react-native-svg";

export type Game = {
  name: string;
  id: string;
  resources: Resource[];
};

export type Resource = {
  name: string;
  packs: ResourcePack[];
};

export type ResourcePack = {
  name: string;
  value: number;
  quantity: number;
};

export type AddGameInitialValues = {
  name: string;
  resources: Resource[];
};

export type RootStackParamList = {
  Main?: {
    screen: keyof MainTabParamList;
  };
  Game: {
    gameId: string;
  };
  Edit: {
    gameId: string;
  };
  NotFound: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Games: undefined;
  Add: undefined;
  Settings: undefined;
};

export type OnboardingItemType = {
  title: string;
  text: string;
  // image: ImageSourcePropType;
  key: number;
  Svg: FC<SvgProps>;
};

export type OnboardingState = {
  currentIndex: number;
  hasOnboarded: boolean;
};
