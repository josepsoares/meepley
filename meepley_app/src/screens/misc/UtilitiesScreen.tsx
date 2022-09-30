import React from "react";
import { Box, Flex, Text } from "native-base";

import Emoji from "../../components/common/Emoji";

// TODO
//* finish features of this screen

const utilities = [
  {
    name: "Dados",
    emoji: "🎲",
  },
  {
    name: "Quem joga primeiro?",
    emoji: "💥",
  },
  {
    name: "Cronómetro",
    emoji: "⏳",
  },
  {
    name: "Calculadora",
    emoji: "🧮",
  },
];

const UtilitiesScreen = () => {
  return (
    <Box w="full" h="100%" bgColor="white" p={12}>
      <Text textAlign="center" pb={10}>
        Ferramentas para auxiliar as tuas partidas!
      </Text>
      <Flex wrap="wrap" justifyContent="space-between" direction="row">
        {utilities.map((item, i) => (
          <Flex
            key={i}
            mt={3}
            w="45%"
            h="40"
            bg="gray.300"
            rounded="md"
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box style={{ height: 32 }}>
              <Emoji size={32} emo={item.emoji} />
            </Box>
            <Text pt="4" textAlign="center">
              {item.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default UtilitiesScreen;
