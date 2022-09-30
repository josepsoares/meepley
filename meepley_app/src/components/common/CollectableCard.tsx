import React from "react";

import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import useCardAttributesIcons, {
  ICardAttributesIconsKeys,
} from "./CardAttributesIcons";

const CollectableCard: React.FC<{ card: ICard; unlocked: boolean }> = ({
  card,
  unlocked,
}) => {
  const { name, image, description, attributes, rarity, external_url } = card;
  const attributeIcons = useCardAttributesIcons({ width: 15, height: 15 });

  return (
    <Flex
      mb="4"
      py="2"
      w="full"
      borderRadius="30"
      justifyContent="center"
      alignItems="center"
      style={{ elevation: 2 }}
      bg={{
        linearGradient: {
          colors: rarity.gradient,
          start: [0, 1],
          end: [1, 0],
        },
      }}
    >
      {!unlocked ? (
        <Flex position="absolute" left="19%" top="12%">
          <Icon
            size="56"
            zIndex="2"
            as={Ionicons}
            name="lock-closed"
            color="gray.400"
            opacity="0.85"
          />
        </Flex>
      ) : null}

      <Box w="96%">
        <Image
          borderTopRadius="30"
          accessibilityRole="image"
          accessibilityLabel="image"
          source={require("../../assets/images/placeholder.png")}
          opacity={!unlocked ? 0.4 : 1}
          alt={`${name} imagem`}
          w="full"
          h="56"
          resizeMode="cover"
        />
        <Box
          pt="4"
          pb="10"
          px="6"
          mt="-6"
          w="full"
          bgColor="white"
          borderRadius="30"
        >
          <HStack
            mt="-8"
            pb="4"
            w="100%"
            justifyContent="center"
            alignItems="center"
            space="1"
          >
            {attributes.map((attr, i) => (
              <Center
                key={i}
                bgColor={attr.attribute.color}
                h="10"
                w="10"
                borderColor="white"
                borderRadius="full"
                borderWidth="2"
                opacity={!unlocked ? 0.4 : 1}
              >
                {
                  attributeIcons[
                    attr.attribute.name.toLowerCase() as ICardAttributesIconsKeys
                  ]
                }
              </Center>
            ))}
          </HStack>
          <Heading opacity={!unlocked ? 0.4 : 1} textAlign="center">
            {name}
          </Heading>
          <Divider my={4} color="gray.300" />
          <Text opacity={!unlocked ? 0.4 : 1}>{description}</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default CollectableCard;
