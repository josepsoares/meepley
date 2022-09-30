/**
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../../ts/types/navigation";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      CalibrationOnboarding: "calibration-onboarding",
      CreateMatch: "create-matchroom",
      Matchroom: "matchroom",
      Profile: "profile",
      Dashboard: "dashboard",
      Place: "place",
      Chat: "chat",
      Settings: "settings",
      InitialOnboarding: "initial-onboarding",
      BoardgamesList: "boardgames-list",
      Boardgame: "boardgame",
      Utilities: "utilities",
      Modal: "modal",
      Login: "login",
      Register: "register",
      NotFound: "*",
    },
  },
};

export default linking;
