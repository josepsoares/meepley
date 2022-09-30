import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  textWithShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export const toastStyles = {
  style: {
    width: "95%",
    bottom: -38.5,
  },
};
