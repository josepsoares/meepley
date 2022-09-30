import React from "react";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Flex,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  useToast,
} from "native-base";
import { Feather } from "@expo/vector-icons";

import Emoji from "../../../../components/common/Emoji";
import ErrorSection from "../../../../components/feedback/ErrorSection";
import Loading from "../../../../components/feedback/Loading";

import MeePleyAPI from "../../../../services/api/meepley";
import calibrationStore from "../../../../services/store/calibrationStore";
import { IBgCategoryMechanic } from "../../../../ts/interfaces/boardgames/IBgCategoryMechanic";

const contents = [
  { name: "Fantasia", emoji: "🦄", bgg_id: 1010 },
  { name: "Medieval", emoji: "👑", bgg_id: 1035 },
  { name: "Mistério", emoji: "🔍", bgg_id: 1040 },
  { name: "Ficção Cientifica", emoji: "🧬", bgg_id: 1016 },
  { name: "Horror", emoji: "👻", bgg_id: 1024 },
  { name: "Puzzle", emoji: "🧩", bgg_id: 1028 },
  { name: "Aventura", emoji: "🤠", bgg_id: 1022 },
  { name: "Party Game", emoji: "🥳", bgg_id: 1030 },
  { name: "Wargame", emoji: "⚔️", bgg_id: 1019 },
  { name: "Desportos", emoji: "⚽", bgg_id: 1038 },
  { name: "Card Game", emoji: "🃏", bgg_id: 1002 },
  { name: "Estratégia", emoji: "🧠", bgg_id: 1009 },
];

const CategoriesScreen = () => {
  const {
    isLoading,
    error,
    data: bgCategories,
  } = useQuery(
    "bg-categories",
    async () => await MeePleyAPI.boardgames.getBoardgameCategories()
  );

  const toast = useToast();
  const { selectedCategories } = useSnapshot(calibrationStore);

  return (
    <ScrollView>
      <Flex
        px={8}
        my={10}
        direction="column"
        textAlign="center"
        backgroundColor="white"
      >
        <Heading textAlign="center">
          O teu estilo{"  "}
          <Emoji size={25} emo="😎" />
        </Heading>

        <Text pt={8} textAlign="center">
          Seleciona <Text fontWeight="bold">4</Text> dos teus géneros de jogos
          favoritos!
        </Text>

        <Flex
          pt={6}
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-between"
        >
          {isLoading ? (
            <Loading />
          ) : error ? (
            <ErrorSection err={error} />
          ) : (
            bgCategories &&
            contents.map((category, i: number) => {
              const categoryObj = bgCategories.data.find(
                (item) => item.bgg_id === category.bgg_id
              );

              const isCategorySelected = selectedCategories.find(
                (item) => item.bgg_id === category?.bgg_id
              );

              //* this determines if the pressable has a margin bottom or not, we dont want the last to
              //* pressables to have it, so we do this condition
              const pressHasMb = contents && i < contents.length - 2 ? 4 : 0;

              return (
                <Pressable
                  key={category?.name}
                  mb={pressHasMb}
                  width="43.5%"
                  onPress={() => {
                    //* check the pressed button is related to a category that is already selected
                    //* if so we remove that category from the list
                    if (isCategorySelected) {
                      calibrationStore.selectedCategories = [
                        ...selectedCategories.filter(
                          (item) => item.bgg_id !== category?.bgg_id
                        ),
                      ];
                    } else if (
                      //* verify if the user selected less than 4 categories,
                      //* if so add the category to the selected list
                      calibrationStore.selectedCategories.length < 4
                    ) {
                      calibrationStore.selectedCategories = [
                        ...selectedCategories,
                        categoryObj as IBgCategoryMechanic,
                      ];
                    } else {
                      //* user has already selected 4 categories, show a warning
                      if (!toast.isActive("categories-toast")) {
                        toast.show({
                          id: "categories-toast",
                          title: "Limite de categorias atingido!",
                          status: "warning",
                          description:
                            "Já tens quatro categorias selecionadas, não podes escolhar mais nenhuma!",
                          placement: "bottom",
                          style: {
                            width: "95%",
                            bottom: -38.5,
                          },
                        });
                      }
                    }
                  }}
                >
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="30"
                    height="32"
                    borderWidth="1"
                    position="relative"
                    borderColor={isCategorySelected ? "brand.500" : "gray.400"}
                  >
                    {isCategorySelected && (
                      <Flex
                        width="30"
                        height="30"
                        position="absolute"
                        top="-5%"
                        left="75%"
                        rounded="full"
                        borderWidth="4"
                        borderColor="white"
                        backgroundColor="brand.500"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Icon
                          color="white"
                          size="3"
                          shadow="2"
                          as={Feather}
                          name="check"
                        />
                      </Flex>
                    )}
                    <Emoji size={40} emo={category.emoji} />
                  </Flex>
                  <Text
                    mt={2}
                    textAlign="center"
                    fontSize="16"
                    color={isCategorySelected ? "brand.500" : "gray.400"}
                  >
                    {category?.name}
                  </Text>
                </Pressable>
              );
            })
          )}
        </Flex>
      </Flex>
    </ScrollView>
  );
};

export default CategoriesScreen;
