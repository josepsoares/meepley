import React, { useState } from "react";
import { StatusBar, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "react-query";

import {
  Stack,
  FormControl,
  Checkbox,
  Center,
  Text,
  Pressable,
  Divider,
  VStack,
  PresenceTransition,
  Select,
} from "native-base";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import MeePleyAPI from "../../services/api/meepley";
import { filtersStore } from "../../services/store/filtersStore";
import { initialMatchroomsFilter } from "../../utils/constants/initialFilters";
import { StackParamList } from "../../navigation";

const durations = [
  "10 minutos",
  "20 minutos",
  "30 minutos",
  "45 minutos",
  "60 minutos",
  "90 minutos",
  "120 minutos",
  "4 horas",
  "6 horas",
  "O dia todo",
  "Vários dias",
];

const MatchroomFilteringScreen: React.FC<
  NativeStackScreenProps<StackParamList, "MatchroomFiltering">
> = ({ navigation }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllDurationOptions, setShowAllDurationOptions] = useState(false);
  const [matchroomsFilter, setMatchroomsFilter] = useState(
    initialMatchroomsFilter
  );

  const {
    isLoading: loadingPlaceTypes,
    error: placeTypesError,
    data: placeTypesData,
  } = useQuery("place-types", MeePleyAPI.places.getPlaceTypes);

  const {
    isLoading: loadingCategories,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(
    "bg-categories",
    MeePleyAPI.boardgames.getBoardgameMechanics,
    {}
  );

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
                Ordenar pelo campo:
              </Text>
            </FormControl.Label>
            <VStack space="2">
              <SelectInput
                selectedValue={matchroomsFilter.orderByProperty}
                onValueChange={(val) =>
                  setMatchroomsFilter((prevState) => ({
                    ...prevState,
                    orderByProperty: val,
                  }))
                }
              >
                <Select.Item label="Nome" value="name" />
                <Select.Item label="Ranking" value="name" />
                <Select.Item label="Jogadores" value="name" />
              </SelectInput>
              <SelectInput
                selectedValue={matchroomsFilter.order}
                onValueChange={(val) =>
                  setMatchroomsFilter((prevState) => ({
                    ...prevState,
                    order: val,
                  }))
                }
              >
                <Select.Item label="Asc." value="asc" />
                <Select.Item label="Desc." value="desc" />
              </SelectInput>
            </VStack>
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Privacidade
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter((prevState) => ({
                  ...prevState,
                  privacy: values,
                }))
              }
              value={matchroomsFilter.privacy as string[] | undefined}
              accessibilityLabel=""
            >
              <VStack space="2">
                <Checkbox value="public" colorScheme="brand">
                  Pública
                </Checkbox>
                <Checkbox value="private" colorScheme="brand">
                  Privada
                </Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Estado da partida
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter((prevState) => ({
                  ...prevState,
                  status: values,
                }))
              }
              value={matchroomsFilter.status}
              accessibilityLabel=""
            >
              <VStack space="2">
                <Checkbox value="one" colorScheme="brand">
                  A decorrer
                </Checkbox>
                <Checkbox value="two" colorScheme="brand">
                  Marcada
                </Checkbox>
                <Checkbox value="two" colorScheme="brand">
                  À procura de jogadores
                </Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Duração estimada
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter((prevState) => ({
                  ...prevState,
                  estimatedDurations: values,
                }))
              }
              value={matchroomsFilter.estimatedDurations}
              accessibilityLabel=""
            >
              <VStack space="2">
                {durations.slice(0, 5).map((item) => (
                  <Checkbox key={item} value={item} colorScheme="brand">
                    {item}
                  </Checkbox>
                ))}
                <PresenceTransition
                  visible={showAllDurationOptions}
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
                  {durations.slice(5).map((item) => (
                    <Checkbox key={item} value={item} colorScheme="brand">
                      {item}
                    </Checkbox>
                  ))}
                </PresenceTransition>
                <Pressable
                  mt="4"
                  onPress={() =>
                    setShowAllDurationOptions(!showAllDurationOptions)
                  }
                >
                  <Text underline color="brand.600">
                    {showAllDurationOptions
                      ? "Ver todas as durações estimadas"
                      : "Minimizar durações estimadas"}
                  </Text>
                </Pressable>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Tipo de Local
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter((prevState) => ({
                  ...prevState,
                  placeTypes: values,
                }))
              }
              value={matchroomsFilter.placeTypes}
              accessibilityLabel=""
            >
              <VStack space="2">
                {loadingPlaceTypes ? (
                  <Loading />
                ) : placeTypesError ? (
                  <ErrorSection err={placeTypesError} />
                ) : (
                  placeTypesData?.data.map((item) => (
                    <Checkbox
                      key={item.id}
                      value={item.name}
                      colorScheme="brand"
                    >
                      {item.name}
                    </Checkbox>
                  ))
                )}
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Categorias de boardgames na sala
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter((prevState) => ({
                  ...prevState,
                  bgCategories: values,
                }))
              }
              value={matchroomsFilter.bgCategories}
              accessibilityLabel="choose numbers"
            >
              <VStack space="2">
                {loadingCategories ? (
                  <Loading />
                ) : categoriesError ? (
                  <ErrorSection err={categoriesError} />
                ) : (
                  categoriesData?.data.slice(0, 14).map((item) => (
                    <Checkbox
                      key={item.id}
                      value={item.name}
                      colorScheme="brand"
                    >
                      {item.name}
                    </Checkbox>
                  ))
                )}
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
                  {categoriesData?.data.slice(14).map((item) => (
                    <Checkbox
                      colorScheme="brand"
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </Checkbox>
                  ))}
                </PresenceTransition>
                <Pressable
                  mt="4"
                  onPress={() => setShowAllCategories(!showAllCategories)}
                >
                  <Text underline color="brand.600">
                    {showAllCategories
                      ? "Ver todas as categorias"
                      : "Minimizar categorias"}
                  </Text>
                </Pressable>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          {/* <FormControl w="100%">
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Dificuldade
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setMatchroomsFilter({
                  ...matchroomsFilter,
                  difficulties: values,
                })
              }
              value={matchroomsFilter.difficulties}
              accessibilityLabel="choose numbers"
            >
              <HStack alignItems="center" flexWrap="wrap">
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
              </HStack>
            </Checkbox.Group>
          </FormControl> */}

          <Center mt="8">
            <Btn
              minWidth="40"
              variant="solid"
              onPress={() => {
                filtersStore.matchrooms = matchroomsFilter;
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              Aplicar filtros
            </Btn>
            <Pressable
              mt="6"
              onPress={() => setMatchroomsFilter(initialMatchroomsFilter)}
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

export default MatchroomFilteringScreen;
