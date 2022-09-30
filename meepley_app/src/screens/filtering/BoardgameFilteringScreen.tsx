import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Box,
  ScrollView,
  Stack,
  FormControl,
  Text,
  Pressable,
  Select,
  Checkbox,
  Center,
  VStack,
  Divider,
  PresenceTransition,
  Radio,
} from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";
import { filtersStore } from "../../services/store/filtersStore";
import { initialBoardgamesFilter } from "../../utils/constants/initialFilters";

import MeePleyAPI from "../../services/api/meepley";
import { StackParamList } from "../../navigation";

const BoardgameFilteringScreen: React.FC<
  NativeStackScreenProps<StackParamList, "BoardgameFiltering">
> = ({ navigation }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllMechanics, setShowAllMechanics] = useState(false);
  const [boardgamesFilter, setBoardgamesFilter] = useState(
    initialBoardgamesFilter
  );

  const {
    isLoading: loadingCategories,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(
    "bg-categories",
    MeePleyAPI.boardgames.getBoardgameCategories,
    {}
  );

  const {
    isLoading: loadingMechanics,
    error: mechanicsError,
    data: mechanicsData,
  } = useQuery("bg-mechanics", MeePleyAPI.boardgames.getBoardgameMechanics, {});

  const {
    isLoading: loadingSkills,
    error: SkillsError,
    data: skillsData,
  } = useQuery("bg-skills", MeePleyAPI.boardgames.getBoardgameSkills, {});

  return (
    <>
      <StatusBar backgroundColor="white" />

      <ScrollView>
        <Stack p="8" space="4">
          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Ordenar por:
              </Text>
            </FormControl.Label>
            <VStack space="2">
              <SelectInput
                selectedValue={boardgamesFilter.orderByProperty}
                onValueChange={(val) =>
                  setBoardgamesFilter({
                    ...boardgamesFilter,
                    orderByProperty: val,
                  })
                }
              >
                <Select.Item label="Nome" value="name" />
                <Select.Item label="Rank" value="rank" />
                <Select.Item label="Ano Lançamento" value="year_released" />
              </SelectInput>
              <SelectInput
                selectedValue={boardgamesFilter.order}
                onValueChange={(val) =>
                  setBoardgamesFilter({
                    ...boardgamesFilter,
                    order: val,
                  })
                }
              >
                <Select.Item label="Asc." value="asc" />
                <Select.Item label="Desc." value="desc" />
              </SelectInput>
            </VStack>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Dificuldade
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              value={boardgamesFilter.difficulties}
              accessibilityLabel=""
              onChange={(values) =>
                setBoardgamesFilter({
                  ...boardgamesFilter,
                  difficulties: values,
                })
              }
            >
              <VStack space="2">
                {loadingSkills ? (
                  <Loading />
                ) : SkillsError ? (
                  <ErrorSection err={SkillsError} />
                ) : (
                  skillsData?.data.map((item) => (
                    <Checkbox
                      colorScheme="brand"
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </Checkbox>
                  ))
                )}
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Categorias
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setBoardgamesFilter({
                  ...boardgamesFilter,
                  bgCategories: values,
                })
              }
              value={boardgamesFilter.bgCategories}
              accessibilityLabel=""
            >
              <VStack space="2">
                {loadingCategories ? (
                  <Loading />
                ) : categoriesError ? (
                  <ErrorSection err={categoriesError} />
                ) : (
                  categoriesData?.data.slice(0, 9).map((item) => (
                    <Checkbox
                      colorScheme="brand"
                      key={item.id}
                      value={item.name}
                      _text={{
                        fontStyle: "italic",
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  ))
                )}
                {showAllCategories && (
                  <PresenceTransition
                    visible={showAllCategories}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 250,
                      },
                    }}
                  >
                    {categoriesData?.data.slice(9).map((item) => (
                      <Checkbox
                        colorScheme="brand"
                        key={item.id}
                        value={item.name}
                        _text={{
                          fontStyle: "italic",
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </PresenceTransition>
                )}

                <Pressable
                  mt="4"
                  onPress={() => setShowAllCategories(!showAllCategories)}
                >
                  <Text underline color="brand.600">
                    {showAllCategories
                      ? "Minimizar categorias"
                      : "Ver todas as categorias"}
                  </Text>
                </Pressable>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Mecânicas
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setBoardgamesFilter({
                  ...boardgamesFilter,
                  bgMechanics: values,
                })
              }
              value={boardgamesFilter.bgMechanics}
              accessibilityLabel=""
            >
              <VStack space="2">
                {loadingMechanics ? (
                  <Loading />
                ) : mechanicsError ? (
                  <ErrorSection err={mechanicsError} />
                ) : (
                  mechanicsData?.data.slice(0, 9).map((item) => (
                    <Checkbox
                      colorScheme="brand"
                      key={item.id}
                      value={item.name}
                      _text={{
                        fontStyle: "italic",
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  ))
                )}
                {showAllMechanics && (
                  <PresenceTransition
                    visible={showAllMechanics}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 250,
                      },
                    }}
                  >
                    {mechanicsData?.data.slice(9).map((item) => (
                      <Checkbox
                        colorScheme="brand"
                        key={item.id}
                        value={item.name}
                        _text={{
                          fontStyle: "italic",
                        }}
                      >
                        {item.name}
                      </Checkbox>
                    ))}
                  </PresenceTransition>
                )}

                <Pressable
                  mt="4"
                  onPress={() => setShowAllMechanics(!showAllMechanics)}
                >
                  <Text underline color="brand.600">
                    {showAllMechanics
                      ? "Minimizar mecânicas"
                      : "Ver todas as mecânicas"}
                  </Text>
                </Pressable>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Número de jogadores minímo
              </Text>
            </FormControl.Label>

            <Radio.Group
              name="Número de jogadores minímo"
              onChange={(val) =>
                setBoardgamesFilter({
                  ...boardgamesFilter,
                  nrMinPlayers: val,
                })
              }
              value={boardgamesFilter.nrMinPlayers}
              accessibilityLabel=""
            >
              <Radio value="2">2 jogadores</Radio>
              <Radio value="3">3 jogadores</Radio>
              <Radio value="4">4 jogadores</Radio>
              <Radio value="5">5 jogadores</Radio>
              <Radio value="6">6 jogadores ou mais</Radio>
            </Radio.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Número de jogadores máximo
              </Text>
            </FormControl.Label>

            <Radio.Group
              name="Número de jogadores máximo"
              onChange={(val) =>
                setBoardgamesFilter({
                  ...boardgamesFilter,
                  nrMaxPlayers: val,
                })
              }
              value={boardgamesFilter.nrMaxPlayers}
              accessibilityLabel=""
            >
              <Radio value="2">2 jogadores</Radio>
              <Radio value="3">3 jogadores</Radio>
              <Radio value="4">4 jogadores</Radio>
              <Radio value="5">5 jogadores</Radio>
              <Radio value="6">6 jogadores ou mais</Radio>
            </Radio.Group>
          </FormControl>

          <Center mt="8">
            <Btn
              minWidth="40"
              width="40"
              variant="solid"
              onPress={() => {
                filtersStore.bgs = boardgamesFilter;
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              Aplicar filtros
            </Btn>
            <Pressable
              mt="6"
              onPress={() => setBoardgamesFilter(initialBoardgamesFilter)}
            >
              <Text underline color="brand.600">
                Restaurar filtros predefinidos
              </Text>
            </Pressable>
          </Center>
        </Stack>
      </ScrollView>
    </>
  );
};

export default BoardgameFilteringScreen;
