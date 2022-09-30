import React from "react";
import { Image } from "react-native";

const LogoTitle = () => {
  return (
    <Image
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="MeePley"
      style={{ width: 175, height: 80 }}
      source={require("../../../assets/images/branding/meepley/logo.png")}
    />
  );
};

export default LogoTitle;
