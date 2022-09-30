import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "react-query";
import { StatusBar } from "expo-status-bar";

import {
  Center,
  Checkbox,
  Divider,
  FormControl,
  Heading,
  HStack,
  Pressable,
  Radio,
  ScrollView,
  Select,
  Stack,
  Text,
  VStack,
} from "native-base";

import { StackParamList } from "../../navigation";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import MeePleyAPI from "../../services/api/meepley";
import { filtersStore } from "../../services/store/filtersStore";
import { initialAchievementsFilter } from "../../utils/constants/initialFilters";

const AchievementFilteringScreen: React.FC<
  NativeStackScreenProps<StackParamList, "AchievementFiltering">
> = ({ navigation }) => {
  const [achievementsFilter, setAchievementsFilter] = useState(
    filtersStore.achievements
  );

  const {
    isLoading: loadingAchvDifficulties,
    error: achvDifficultiesError,
    data: achvDifficultiesData,
  } = useQuery(
    "achievements-difficulties",
    MeePleyAPI.achievements.getAchievementsDifficulties
  );

  const {
    isLoading: loadingAchvTypes,
    error: achvTypesError,
    data: achvTypesData,
  } = useQuery(
    "achievements-types",
    MeePleyAPI.achievements.getAchievementsTypes
  );

  return (
    <>
      <StatusBar backgroundColor="white" />

      <ScrollView>
        <Stack p="8" space="4">
          <FormControl>
            <FormControl.Label>
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Ordenar por:
              </Heading>
            </FormControl.Label>
            <VStack space="2">
              <SelectInput
                placeholder="parâmetro"
                onValueChange={(val) =>
                  setAchievementsFilter((prevState) => ({
                    ...prevState,
                    orderByProperty: val,
                  }))
                }
                selectedValue={achievementsFilter.orderByProperty}
              >
                <Select.Item label="Nome" value="name" />
                <Select.Item label="Dificuldade" value="difficulty" />
              </SelectInput>
              <SelectInput
                placeholder="ordem"
                onValueChange={(val) =>
                  setAchievementsFilter((prevState) => ({
                    ...prevState,
                    order: val,
                  }))
                }
                selectedValue={achievementsFilter.order}
              >
                <Select.Item size="lg" label="Ascendente" value="asc" />
                <Select.Item size="md" label="Descendente" value="desc" />
              </SelectInput>
            </VStack>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Coleção
              </Heading>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setAchievementsFilter((prevState) => ({
                  ...prevState,
                  status: values,
                }))
              }
              value={achievementsFilter.status}
              accessibilityLabel=""
            >
              <VStack space="2">
                <Checkbox colorScheme="brand" value="blocked">
                  Bloqueadas
                </Checkbox>
                <Checkbox colorScheme="brand" value="unblocked">
                  Desbloqueadas
                </Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Dificuldades
              </Heading>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setAchievementsFilter((prevState) => ({
                  ...prevState,
                  difficulties: values,
                }))
              }
              value={achievementsFilter.difficulties}
              accessibilityLabel="choose numbers"
            >
              <VStack w="100%" space="2">
                {loadingAchvDifficulties ? (
                  <Center w="100%">
                    <Loading />
                  </Center>
                ) : achvDifficultiesError ? (
                  <ErrorSection err={achvDifficultiesError} />
                ) : (
                  achvDifficultiesData?.data.map((item) => (
                    <Checkbox
                      key={item.id}
                      colorScheme="brand"
                      value={`${item.id}`}
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
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Tipos
              </Heading>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setAchievementsFilter((prevState) => ({
                  ...prevState,
                  types: values,
                }))
              }
              value={achievementsFilter.types}
              accessibilityLabel=""
            >
              <VStack space="2">
                {loadingAchvTypes ? (
                  <Center w="100%">
                    <Loading />
                  </Center>
                ) : achvTypesError ? (
                  <ErrorSection err={achvTypesError} />
                ) : (
                  achvTypesData?.data.map((item) => (
                    <Checkbox
                      key={item.id}
                      colorScheme="brand"
                      value={`${item.id}`}
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
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Secreta
              </Heading>
            </FormControl.Label>
            <Radio.Group
              name="secret"
              onChange={(val) =>
                setAchievementsFilter((prevState) => ({
                  ...prevState,
                  secret: val,
                }))
              }
              value={achievementsFilter.secret}
              accessibilityLabel=""
            >
              <HStack space="4">
                <Radio size="md" colorScheme="brand" value="true">
                  Sim
                </Radio>
                <Radio size="md" colorScheme="brand" value="false">
                  Não
                </Radio>
              </HStack>
            </Radio.Group>
          </FormControl>

          <Center mt="8">
            <Btn
              minWidth="40"
              variant="solid"
              onPress={() => {
                filtersStore.achievements = achievementsFilter;
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              Aplicar filtros
            </Btn>
            <Pressable
              mt="6"
              onPress={() => setAchievementsFilter(initialAchievementsFilter)}
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

export default AchievementFilteringScreen;
