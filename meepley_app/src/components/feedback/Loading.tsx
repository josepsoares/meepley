import React from "react";
import LottieView from "lottie-react-native";

import { Center, Heading } from "native-base";

import { rnd } from "../../utils/helpers/main/random";

const loadingMessages = [
  "A carregar estratégias...",
  "A lançar os dados...",
  "A procurar party players...",
  "A preparar o tabuleiro...",
  "A mergulhar em mundos distantes...",
  "A contar pontos...",
  "A arrumar o tabuleiro...",
  "A fazer unboxing de um boardgame...",
  "A viajar para uma convenção...",
  "A ler as regras do jogo...",
];

const Loading: React.FC<{
  isBgWhite?: boolean;
  hasMessage?: true;
  customMessage?: string;
  size?: number;
}> = ({ isBgWhite = true, hasMessage = true, customMessage, size = 150 }) => {
  const randomMessage = loadingMessages[rnd(loadingMessages.length - 1)];

  return (
    <Center w="100%">
      <LottieView
        autoPlay
        style={{
          width: 150,
          height: 150,
        }}
        source={
          isBgWhite
            ? require("../../assets/animations/dice-animation-white.json")
            : require("../../assets/animations/dice-animation-gray.json")
        }
      />
      {hasMessage ? (
        <Heading fontSize="16">{customMessage || randomMessage}</Heading>
      ) : null}
    </Center>
  );
};

export default Loading;
