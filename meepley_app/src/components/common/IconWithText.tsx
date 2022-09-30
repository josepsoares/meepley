import React from "react";
import { Flex, Icon, Text } from "native-base";
import { EvilIcons } from "@expo/vector-icons";
import { AccessibilityRole } from "react-native";

const TextWithIcon: React.FC<{
  w?: string;
  iconName: string;
  text: (string | undefined)[] | string;
  fontStyle?: string;
  iconLibrary?: any;
  accLabel: string;
  align?: string;
  padding?: number;
}> = ({
  iconName,
  text,
  w = "100%",
  fontStyle = "normal",
  iconLibrary = EvilIcons,
  accLabel,
  align = "center",
  padding = 0,
}) => {
  return (
    <Flex width={w} flexDirection="row" alignItems={align} pb={padding}>
      <Icon
        size="6"
        color="brand.500"
        as={iconLibrary}
        name={iconName}
        accessibilityLabel={accLabel}
        accessibilityRole="image"
        mr={3}
        mb={1}
      />
      <Text flexShrink="1" fontStyle={fontStyle}>
        {text}
      </Text>
    </Flex>
  );
};

export default TextWithIcon;
