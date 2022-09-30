import React from "react";
import { Flex, Heading, Image, ScrollView, Text } from "native-base";

import Emoji from "../../../../components/common/Emoji";

const WelcomeScreen = () => {
  return (
    <ScrollView>
      <Flex
        px={8}
        my={10}
        direction="column"
        textAlign="center"
        backgroundColor="white"
        _text={{ textAlign: "center" }}
      >
        <Image
          h="56"
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="image"
          alt="Família a jogar jogos de tabuleiro"
          source={require("../../../../assets/images/illustration-playing-family.png")}
        />

        <Heading textAlign="center">
          Olá! Sê bem-vindo ao MeePley{"  "}
          <Emoji size={25} emo="👋" />
        </Heading>

        <Text pt={8} textAlign="left">
          Vamos fazer-te algumas perguntas para podermos personalizar o MeePley
          tendo em conta as tuas preferências.{"\n"}Os dados guardados das tuas
          preferências não serão visivéis para ninguém
        </Text>
      </Flex>
    </ScrollView>
  );
};

export default WelcomeScreen;
