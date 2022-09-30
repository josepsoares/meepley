import React from "react";
import { Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSnapshot } from "valtio";

import { Flex, Heading, Text } from "native-base";

import Btn from "../common/buttons/Btn";

import authStore from "../../services/store/authStore";
import { rnd } from "../../utils/helpers/main/random";

interface ISpecificError {
  text: string;
  subtext: string;
}

interface IErrors {
  "400": ISpecificError;
  "401": ISpecificError;
  "404": ISpecificError;
  "500": ISpecificError;
}

const errors = {
  "400": {
    text: "Estás a procurar um meeple que não existe!",
    subText: "Volta à página inicial para não te perderes novamente.",
  },
  "401": {
    text: "A party no D&D que te estás a tentar juntar é exclusiva!",
    subText:
      "Volta à página inicial para te registares no MeePley e entrares na party.",
  },
  "404": {
    text: "Alguém perdeu e espalhou as peças todas do tabuleiro!",
    subText:
      "Volta à página inicial enquanto procuramos o que foi perdido no tabuleiro e organizamos tudo.",
  },
  "500": {
    text: "Parece que alguém mandou a mesa abaixo e o boardgame lá se foi à vida!",
    subText:
      "Volta à página inicial enquanto tentamos meter tudo de volta no sítio.",
  },
};

const errorImgs = [
  require("../../assets/images/error/error-1.png"),
  require("../../assets/images/error/error-2.png"),
  require("../../assets/images/error/error-3.png"),
];

const Error: React.FC<{ type: string }> = ({ type }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isAuth } = useSnapshot(authStore);
  const { [type as keyof IErrors]: err } = errors;

  const randomImg = rnd(errorImgs.length);

  return (
    <Flex
      py={4}
      direction="column"
      alignItems="center"
      _text={{ textAlign: "center" }}
    >
      <Image
        accessibilityRole="image"
        accessibilityLabel="image"
        resizeMode="cover"
        source={errorImgs[randomImg]}
        style={{ height: 300 }}
      />
      <Heading pb={4}>Ops!</Heading>
      <Text pb={4}>{err.text}</Text>
      <Btn
        variant="solid"
        onPress={() => navigation.navigate(isAuth ? "Dashboard" : "Login")}
      >
        {route.name === "Dashboard" ? "Recarregar" : "Voltar ao Dashboard"}
      </Btn>
    </Flex>
  );
};

export default Error;
