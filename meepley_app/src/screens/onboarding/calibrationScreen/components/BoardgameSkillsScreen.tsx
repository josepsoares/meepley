import React from "react";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Pressable,
  ScrollView,
  Text,
} from "native-base";
import { Feather } from "@expo/vector-icons";

import Emoji from "../../../../components/common/Emoji";
import ErrorSection from "../../../../components/feedback/ErrorSection";
import Loading from "../../../../components/feedback/Loading";

import MeePleyAPI from "../../../../services/api/meepley";
import calibrationStore from "../../../../services/store/calibrationStore";

const BoardgameSkillsScreen = () => {
  const {
    isLoading,
    error,
    data: bgSkills,
  } = useQuery(
    "bg-skills",
    async () => await MeePleyAPI.boardgames.getBoardgameSkills()
  );

  const { selectedBgSkill } = useSnapshot(calibrationStore);

  return (
    <ScrollView>
      <Flex
        px={8}
        mt={10}
        mb={16}
        direction="column"
        textAlign="center"
        backgroundColor="white"
      >
        <Image
          accessibilityRole="image"
          accessibilityLabel="image"
          resizeMode="contain"
          h="56"
          alt="Casal a jogar jogos de tabuleiro"
          source={require("../../../../assets/images/illustration-playing.png")}
        />

        <Text pt={8} textAlign="center">
          Qual é o teu nível de experiência com jogos de tabuleiro?
        </Text>

        <HStack pt={6} justifyContent="space-between">
          {isLoading ? (
            <Center>
              <Loading />
            </Center>
          ) : error ? (
            <ErrorSection err={error} />
          ) : (
            bgSkills?.data.map((expItem, i) => {
              const isSelectedExp = selectedBgSkill?.name === expItem.name;

              return (
                <Pressable
                  key={i}
                  width="28%"
                  height="20"
                  onPress={() =>
                    (calibrationStore.selectedBgSkill = isSelectedExp
                      ? null
                      : {
                          name: expItem.name,
                          id: expItem.id,
                        })
                  }
                >
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="30"
                    height="20"
                    borderWidth="1"
                    position="relative"
                    borderColor={isSelectedExp ? "brand.500" : "gray.400"}
                  >
                    {isSelectedExp && (
                      <Flex
                        top="-5%"
                        left="75%"
                        width="30"
                        height="30"
                        rounded="full"
                        borderWidth="4"
                        borderColor="white"
                        position="absolute"
                        backgroundColor="brand.500"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Icon
                          size="3"
                          shadow="2"
                          color="white"
                          as={Feather}
                          name="check"
                        />
                      </Flex>
                    )}
                    <Emoji size={30} emo={expItem.emoji} />
                  </Flex>
                  <Text
                    pt={2}
                    textAlign="center"
                    color={isSelectedExp ? "brand.500" : "gray.400"}
                  >
                    {expItem.name}
                  </Text>
                </Pressable>
              );
            })
          )}
        </HStack>
      </Flex>
    </ScrollView>
  );
};

export default BoardgameSkillsScreen;
