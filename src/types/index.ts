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
  Main: {
    screen?: "Games" | "Add" | "Settings";
  };
  Game: {
    gameId: string;
  };
  Edit: {
    gameId: string;
  };
  NotFound: undefined;
};

export type MainTabParamList = {
  Games: undefined;
  Add: undefined;
  Settings: undefined;
};
