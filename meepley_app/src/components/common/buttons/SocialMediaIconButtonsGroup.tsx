import React from "react";

import { HStack, IconButton, Icon } from "native-base";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import openUrlInExteriorApp from "../../../utils/helpers/navigation/openUrlInExteriorApp";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
} from "../../../utils/constants/contact";

const SocialMediaIconButtonsGroup = () => {
  return (
    <HStack mx="auto" space="1">
      <IconButton
        variant="ghost"
        colorScheme="brand"
        borderRadius="full"
        icon={<Icon as={FontAwesome5} name="facebook" color="brand.500" />}
        onPress={() => {
          openUrlInExteriorApp("fb://page/106992375280461", FACEBOOK_URL);
        }}
      />
      <IconButton
        variant="ghost"
        colorScheme="brand"
        borderRadius="full"
        icon={<Icon as={Ionicons} name="logo-instagram" color="brand.500" />}
        onPress={() => {
          openUrlInExteriorApp(
            "instagram://user?username=meepley_app",
            INSTAGRAM_URL
          );
        }}
      />
      <IconButton
        variant="ghost"
        colorScheme="brand"
        borderRadius="full"
        icon={<Icon as={Ionicons} name="logo-twitter" color="brand.500" />}
        onPress={() => {
          openUrlInExteriorApp(
            "twitter://user?id=1503176008656207879",
            TWITTER_URL
          );
        }}
      />
    </HStack>
  );
};

export default SocialMediaIconButtonsGroup;
