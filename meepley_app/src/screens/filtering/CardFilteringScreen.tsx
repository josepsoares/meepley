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
  Heading,
  Select,
  Divider,
  VStack,
} from "native-base";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import MeePleyAPI from "../../services/api/meepley";
import { StackParamList } from "../../navigation";
import { filtersStore } from "../../services/store/filtersStore";
import { initialCardsFilter } from "../../utils/constants/initialFilters";

const CardFilteringScreen: React.FC<
  NativeStackScreenProps<StackParamList, "CardFiltering">
> = ({ navigation }) => {
  const [cardsFilter, setCardsFilter] = useState(initialCardsFilter);

  const {
    isLoading: loadingRarities,
    error: raritiesError,
    data: raritiesData,
  } = useQuery("cards-rarities", MeePleyAPI.cards.getCardRarities);

  const {
    isLoading: loadingAttrs,
    error: attrsError,
    data: attrsData,
  } = useQuery("cards-attributess", MeePleyAPI.cards.getCardAttributes);

  return (
    <>
      <StatusBar backgroundColor="white" />

      <ScrollView>
        <Stack space="4" p="8">
          <FormControl>
            <FormControl.Label>
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Ordenar por:
              </Heading>
            </FormControl.Label>
            <VStack space="2">
              <SelectInput
                selectedValue={cardsFilter.orderByProperty}
                onValueChange={(val) =>
                  setCardsFilter((prevState) => ({
                    ...prevState,
                    orderByProperty: val,
                  }))
                }
              >
                <Select.Item label="Nome" value="name" />
              </SelectInput>
              <SelectInput
                selectedValue={cardsFilter.order}
                onValueChange={(val) =>
                  setCardsFilter((prevState) => ({
                    ...prevState,
                    order: val,
                  }))
                }
              >
                <Select.Item label="Asc." value="asc" />
                <Select.Item size="md" label="Desc." value="desc" />
              </SelectInput>
            </VStack>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Text pb="2" fontWeight="bold">
                Coleção
              </Text>
            </FormControl.Label>
            <Checkbox.Group
              onChange={(values) =>
                setCardsFilter((prevState) => ({
                  ...prevState,
                  status: values,
                }))
              }
              value={cardsFilter.status}
              accessibilityLabel=""
            >
              <VStack space="2">
                <Checkbox colorScheme="brand" value="non-obtained">
                  Não obtidas
                </Checkbox>
                <Checkbox colorScheme="brand" value="obtained">
                  Obtidas
                </Checkbox>
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Divider w="65%" mx="auto" my="2" />

          <FormControl w="100%">
            <FormControl.Label>
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Raridades
              </Heading>
            </FormControl.Label>
            <Checkbox.Group
              value={cardsFilter.rarities}
              accessibilityLabel=""
              onChange={(values) =>
                setCardsFilter((prevState) => ({
                  ...prevState,
                  rarities: values,
                }))
              }
            >
              <VStack space="2">
                {loadingRarities ? (
                  <Loading />
                ) : raritiesError ? (
                  <ErrorSection err={raritiesError} />
                ) : (
                  raritiesData?.data.map((item) => (
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
              <Heading fontSize="16" pb="2" fontWeight="bold">
                Atributos
              </Heading>
            </FormControl.Label>

            <Checkbox.Group
              value={cardsFilter.attributes}
              accessibilityLabel=""
              onChange={(values) =>
                setCardsFilter((prevState) => ({
                  ...prevState,
                  attributes: values,
                }))
              }
            >
              <VStack space="2">
                {loadingAttrs ? (
                  <Loading />
                ) : attrsError ? (
                  <ErrorSection err={attrsError} />
                ) : (
                  attrsData?.data.map((item) => (
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
              </VStack>
            </Checkbox.Group>
          </FormControl>

          <Center mt="8">
            <Btn
              minWidth="40"
              width="40"
              variant="solid"
              onPress={() => {
                filtersStore.cards = cardsFilter;
                navigation.canGoBack() && navigation.goBack();
              }}
            >
              Aplicar filtros
            </Btn>
            <Pressable
              mt="6"
              onPress={() => setCardsFilter(initialCardsFilter)}
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

export default CardFilteringScreen;
