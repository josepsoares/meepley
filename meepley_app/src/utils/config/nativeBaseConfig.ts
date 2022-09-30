import { INativebaseConfig } from "native-base";

export const nbConfig: INativebaseConfig = {
  strictMode: "off",
  disableContrastText: true,
  suppressColorAccessibilityWarning: true,
  dependencies: {
    "linear-gradient": require("expo-linear-gradient").LinearGradient,
  },
};
