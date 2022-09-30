import React, { useRef } from "react";
import { ImageBackground, ScrollView, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { LinearGradient } from "expo-linear-gradient";

import { Box, Text, Flex, Heading, HStack, Pressable } from "native-base";

import Emoji from "../../../components/common/Emoji";
import OnboardingInitialFooter from "./components/InitialScreenFooter";

import openUrl from "../../../utils/helpers/navigation/openUrlInBrowser";
import { _add } from "../../../utils/helpers/main/add";
import SocialMediaIconButtonsGroup from "../../../components/common/buttons/SocialMediaIconButtonsGroup";

const steps = [
  {
    title: "Bem-vindo ao MeePley",
    descriptionLabel:
      "Aqui poderás marcar partidas de jogos de tabuleiro em locais públicos e comerciais de referência de Aveiro 🤩",
    description: (
      <>
        Aqui poderás marcar partidas de jogos de tabuleiro em locais públicos e
        comerciais de referência de Aveiro <Emoji emo="🤩" />
      </>
    ),
    extra: (
      <Box pb="8">
        <Text pb="2">Segue-nos nas nossas redes sociais!</Text>
        <SocialMediaIconButtonsGroup />
      </Box>
    ),
    img: require("../../../assets/images/onboarding/gt1.png"),
    imgLabel: "Jogos de tabuleiro",
  },
  {
    title: "Boardgames e Aveiro!",
    descriptionLabel:
      "Vê os locais disponíveis de referência para jogar boardgames e desfrutar em Aveiro 🗺️",
    description: (
      <>
        Vê os locais disponíveis de referência para jogar boardgames e desfrutar
        em Aveiro <Emoji emo="🗺️" />
      </>
    ),

    img: require("../../../assets/images/onboarding/gt2.png"),
    imgLabel: "Mapa com locais para jogar partidas no MeePley",
  },
  {
    title: "Descobre novos jogos",
    descriptionLabel:
      "Vê os locais disponíveis de referência para jogar boardgames e desfrutar em Aveiro 🎲",
    description: (
      <>
        Fica a conhecer novos jogos de tabuleiro para poderes experimentar com
        outros jogadores <Emoji emo="🎲" />
      </>
    ),
    img: require("../../../assets/images/onboarding/gt3.png"),
    imgLabel: "Lista de cartas de jogos de tabuleiro",
  },
  {
    title: "Chat",
    descriptionLabel:
      "Combina todos os pormenores da partida com os outros jogadores através do nosso chat integrado 😊",
    description: (
      <>
        Combina todos os pormenores da partida com os outros jogadores através
        do nosso chat integrado <Emoji emo="😊" />
      </>
    ),
    img: require("../../../assets/images/onboarding/gt4.png"),
    imgLabel: "Chat do MeePley",
  },
  {
    title: "Tudo à mão",
    descriptionLabel:
      "Temos todos os utilitários que podes precisar numa partida de jogo de tabuleiro ⏲",
    description: (
      <>
        Temos todos os utilitários que podes precisar numa partida de jogo de
        tabuleiro <Emoji emo="⏲" />
      </>
    ),
    img: require("../../../assets/images/onboarding/gt5.png"),
    imgLabel: "Lista de utilitários",
  },
  {
    title: "Aveiro 2027",
    descriptionLabel:
      "Joga connosco boardgames e partilha a candidatura de Aveiro a Capital Europeia da Cultura em 2027! 🌟",
    description: (
      <>
        Joga connosco boardgames e partilha a candidatura de Aveiro a Capital
        Europeia da Cultura em 2027! <Emoji emo="🌟" />
        <Pressable onPress={async () => await openUrl("https://aveiro2027.pt")}>
          <Text
            mt={2}
            underline
            fontSize={14}
            color="brand.600"
            textAlign="center"
          >
            (saber mais)
          </Text>
        </Pressable>
      </>
    ),
    img: require("../../../assets/images/onboarding/gt6.jpg"),
    imgLabel: "Flamingo em Aveiro",
  },
];

const OnboardingInitialScreen = () => {
  const pageViewerRef = useRef<PagerView>(null);

  return (
    <Box backgroundColor="white" flex="1">
      <PagerView
        style={{
          flexGrow: 1,
        }}
        ref={pageViewerRef}
      >
        {steps.map((item, key) => {
          return (
            <ScrollView key={key} contentContainerStyle={{ flexGrow: 1 }}>
              <LinearGradient
                style={{ height: Dimensions.get("screen").height * 0.5 }}
                // Background Linear Gradient
                colors={["transparent", "rgb(255, 255, 255)"]}
              >
                <Box h="100%" zIndex="-1">
                  <ImageBackground
                    accessibilityRole="image"
                    accessibilityLabel={item.imgLabel}
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                    source={item.img}
                  />
                </Box>
              </LinearGradient>

              <Flex justifyContent="center" textAlign="center" px="12" pb="12">
                <HStack pt="4" pb="8" space="3" justifyContent="center">
                  {steps.map((_, dotKey) => (
                    <Pressable
                      key={dotKey}
                      accessibilityLabel={`Botão para navegar para a tela de onboarding ${_add(
                        dotKey,
                        1
                      )}`}
                      accessibilityRole="button"
                      height="3.5"
                      width="3.5"
                      borderRadius="full"
                      backgroundColor={
                        dotKey === key ? "brand.500" : "gray.300"
                      }
                      onPress={() => pageViewerRef.current?.setPage(dotKey)}
                    />
                  ))}
                </HStack>
                <Heading pb="8" textAlign="center">
                  {item.title}
                </Heading>
                <Text
                  pb="8"
                  textAlign="center"
                  accessibilityLabel={item.descriptionLabel}
                >
                  {item.description}
                </Text>
                {item?.extra ? item.extra : null}
                <OnboardingInitialFooter />
              </Flex>
            </ScrollView>
          );
        })}
      </PagerView>
    </Box>
  );
};

export default OnboardingInitialScreen;
