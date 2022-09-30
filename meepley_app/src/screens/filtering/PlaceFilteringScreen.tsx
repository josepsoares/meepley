import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar, ScrollView } from "react-native";
import { useQuery } from "react-query";

import {
  Stack,
  FormControl,
  Checkbox,
  Center,
  Text,
  Pressable,
  VStack,
  Divider,
  Select,
} from "native-base";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import MeePleyAPI from "../../services/api/meepley";
import { filtersStore } from "../../services/store/filtersStore";
import { initialPlacesFilter } from "../../utils/constants/initialFilters";
import { StackParamList } from "../../navigation";

const PlaceFilteringScreen: React.FC<
  NativeStackScreenProps<StackParamList, "PlaceFiltering">
> = ({ navigation }) => {
  const {
    isLoading: loadingPlaceTypes,
    error: placeTypesError,
    data: placeTypesData,
  } = useQuery("place-types", MeePleyAPI.places.getPlaceTypes);

  const [placesFilter, setPlacesFilter] = useState(initialPlacesFilter);

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
                selectedValue={placesFilter.orderByProperty}
                onValueChange={(val) =>
                  setPlacesFilter((prevState) => ({
                    ...prevState,
                    orderByProperty: val,
                  }))
                }
              >
                <Select.Item label="Nome" value="name" />
                <Select.Item label="Avaliações" value="name" />
              </SelectInput>
              <SelectInput
                selectedValue={placesFilter.order}
                onValueChange={(val) =>
                  setPlacesFilter((prevState) => ({
                    ...prevState,
                    order: val,
                  }))
                }
              >
                <Select.Item label="Ascendente" value="asc" />
                <Select.Item label="Descendente" value="desc" />
              </SelectInput>
            </VStack>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Tipos
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setPlacesFilter((prevState) => ({
                  ...prevState,
                  types: values,
                }))
              }
              value={placesFilter.types as string[] | undefined}
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

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Cidades
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setPlacesFilter((prevState) => ({
                  ...prevState,
                  cities: values,
                }))
              }
              value={placesFilter.cities}
              accessibilityLabel=""
            >
              <VStack space={4}>
                <Checkbox value="one">UX Research</Checkbox>
                <Checkbox value="two">Software</Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Vende boardgames
              </Text>
            </FormControl.Label>

            <Checkbox.Group
              onChange={(values) =>
                setPlacesFilter((prevState) => ({
                  ...prevState,
                  sellsBoardgames: values,
                }))
              }
              value={placesFilter.sellsBoardgames}
              accessibilityLabel=""
            >
              <VStack space={4}>
                <Checkbox value="0">Não</Checkbox>
                <Checkbox value="1">Sim</Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Tem boardgames no local para jogar
              </Text>
            </FormControl.Label>

            <Checkbox.Group
              onChange={(values) =>
                setPlacesFilter((prevState) => ({
                  ...prevState,
                  hasBoardgames: values,
                }))
              }
              value={placesFilter.hasBoardgames}
              accessibilityLabel=""
            >
              <VStack space={4}>
                <Checkbox value="0">Não</Checkbox>
                <Checkbox value="1">Sim</Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl>
            <FormControl.Label>
              <Text fontWeight="bold" pb="2">
                Consumo Minímo
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setPlacesFilter((prevState) => ({
                  ...prevState,
                  minimumConsumptions: values,
                }))
              }
              value={placesFilter.minimumConsumptions}
              accessibilityLabel=""
            >
              <VStack space={4}>
                <Checkbox value="consumptionNone">Nenhum</Checkbox>
                <Checkbox value="consumptionLessOne">Menor que 1€</Checkbox>
                <Checkbox value="consumptionLessTwo">Menor que 2€</Checkbox>
                <Checkbox value="consumptionGreaterTwo">Maior que 2€</Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Center mt="8">
            <Btn
              minWidth={40}
              width={40}
              variant="solid"
              onPress={() => {
                filtersStore.places = placesFilter;
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              Aplicar filtros
            </Btn>
            <Pressable
              mt="6"
              onPress={() => setPlacesFilter(initialPlacesFilter)}
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

export default PlaceFilteringScreen;
