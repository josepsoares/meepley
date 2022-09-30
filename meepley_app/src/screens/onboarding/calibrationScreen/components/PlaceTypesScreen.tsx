import React from "react";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Center,
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

const PlaceTypesScreen = () => {
  const {
    isLoading,
    error,
    data: placeTypes,
  } = useQuery("place-types", MeePleyAPI.places.getPlaceTypes);

  const toast = useToast();
  const { selectedPlaceTypes } = useSnapshot(calibrationStore);

  return (
    <ScrollView>
      <Flex
        px={8}
        my={10}
        direction="column"
        textAlign="center"
        backgroundColor="white"
        _text={{ textAlign: "center" }}
      >
        <Heading textAlign="center">
          Tipos de Locais{"  "}
          <Emoji size={25} emo="🗺️" />
        </Heading>

        <Text pt={8} textAlign="center">
          Seleciona <Text fontWeight="bold">4</Text> dos teus tipos de locais
          favoritos para jogar
        </Text>

        <Flex
          pt={6}
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-between"
        >
          {isLoading ? (
            <Center>
              <Loading />
            </Center>
          ) : error ? (
            <ErrorSection err={error} />
          ) : (
            placeTypes &&
            placeTypes.data.map((item, i: number) => {
              const isTypeSelected = selectedPlaceTypes.find(
                (type) => type.name === item.name
              );

              //* this determines if the pressable has a margin bottom or not, we dont want the last to
              //* pressables to have it, so we do this condition
              const pressHasMb =
                placeTypes.data && i < placeTypes.data.length - 2 ? 4 : 0;

              return (
                <Pressable
                  key={item?.name}
                  width="43.5%"
                  mb={pressHasMb}
                  onPress={() => {
                    //* check the pressed button is related to a place type that is already selected
                    //* if so we remove that place type from the list
                    if (isTypeSelected) {
                      calibrationStore.selectedPlaceTypes = [
                        ...selectedPlaceTypes.filter(
                          (selectedItem) => selectedItem.name !== item.name
                        ),
                      ];
                    } else if (
                      //* verify if the user selected less than 4 place types,
                      //* if so add the category to the selected list
                      calibrationStore.selectedPlaceTypes.length < 4
                    ) {
                      calibrationStore.selectedPlaceTypes = [
                        ...selectedPlaceTypes,
                        item,
                      ];
                    } else {
                      //* user has already selected 4 place types, show a warning
                      if (!toast.isActive("place-type-toast")) {
                        toast.show({
                          id: "place-type-toast",
                          title: "Limite atingido!",
                          status: "warning",
                          description:
                            "Já tens quatro tipos de locais selecionados, não podes escolhar mais nenhum!",
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
                    borderColor={isTypeSelected ? "brand.500" : "gray.400"}
                  >
                    {isTypeSelected && (
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
                    <Emoji size={40} emo={item?.emoji} />
                  </Flex>
                  <Text
                    mt={2}
                    textAlign="center"
                    fontSize="16"
                    color={isTypeSelected ? "brand.500" : "gray.400"}
                  >
                    {item.name}
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

export default PlaceTypesScreen;
