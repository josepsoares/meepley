import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, useWindowDimensions } from "react-native";
import { useQuery } from "react-query";
import { StatusBar } from "expo-status-bar";
import { useSnapshot } from "valtio";

import {
  Badge,
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Pressable,
  Stack,
  Text,
} from "native-base";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import debounce from "lodash.debounce";

import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import MeePleyAPI from "../../services/api/meepley";
import { createMatchroomStore } from "../../services/store/createMatchroomStore";
import { filtersStore } from "../../services/store/filtersStore";
import { PlacesListProps } from "../../ts/types/navigation";
import { refreshControlColors } from "../../utils/constants/colors";
import { initialPlacesFilter } from "../../utils/constants/initialFilters";
import checkActiveFiltersLength from "../../utils/helpers/misc/checkActiveFiltersLength";

const PlacesListScreen: React.FC<PlacesListProps> = ({ navigation, route }) => {
  const { previousRoute, initialData } = route.params;

  const { places: placesFilters } = useSnapshot(filtersStore);
  const { height } = useWindowDimensions();
  const refAchievementsList = useRef(null);
  const { place } = useSnapshot(createMatchroomStore);

  const [refreshing, setRefreshing] = useState(false);
  const [searchPlaceName, setSearchPlaceName] = useState("");

  const {
    isLoading,
    error,
    data: places,
    refetch,
  } = useQuery(
    ["places", { name: searchPlaceName, ...placesFilters }],
    (filters) => MeePleyAPI.places.getPlaces(filters),
    {
      onSettled: () => setRefreshing(false),
      initialData: { data: initialData, message: "" },
    }
  );

  const isChoosingPlaceToMatchroom = previousRoute === "createMatch";

  const inputPlaceHandler = (text: string) => {
    setSearchPlaceName(text);
  };

  const debouncedInputPlaceHandler = useMemo(
    () => debounce(inputPlaceHandler, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedInputPlaceHandler.cancel();
    };
  }, []);

  const checkActivePlacesFilters = checkActiveFiltersLength(placesFilters);

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />

      <Box minHeight={height} backgroundColor="#FAFAFA" mb="20">
        {isLoading ? (
          <Box px={8}>
            <Loading isBgWhite={false} />
          </Box>
        ) : error ? (
          <Box px={8}>
            <ErrorSection err={error} />
          </Box>
        ) : (
          <>
            <FlatList
              refreshControl={
                <RefreshControl
                  {...refreshControlColors}
                  refreshing={refreshing}
                  onRefresh={async () => {
                    setRefreshing(true);
                    refetch();
                  }}
                />
              }
              ref={refAchievementsList}
              data={places?.data && places.data.map((place) => place).flat()}
              contentContainerStyle={{ padding: 32, paddingBottom: 100 }}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const categoriesString = item.types.map((types, i) =>
                  i === item.types.length - 1
                    ? types.type.name
                    : `${types.type.name}, `
                );

                return (
                  <Pressable
                    mb={6}
                    key={index}
                    onPress={() => {
                      createMatchroomStore.place = item;
                    }}
                  >
                    <Box
                      backgroundColor={
                        place?.name === item.name ? "lGreen.700" : "brand.500"
                      }
                      borderRadius="20"
                      overflow="hidden"
                      shadow={4}
                      _dark={{
                        borderColor: "coolGray.600",
                      }}
                      _web={{
                        shadow: 2,
                        borderWidth: 0,
                      }}
                    >
                      <Box>
                        <Image
                          w="full"
                          h="40"
                          accessibilityRole="image"
                          accessibilityLabel="image"
                          alt={`Imagem do local ${item.name} `}
                          resizeMode="cover"
                          source={{
                            uri: item.image,
                          }}
                        />
                        {isChoosingPlaceToMatchroom ? (
                          <Center
                            position="absolute"
                            top="10"
                            right="-10"
                            bgColor="white"
                            borderRadius="full"
                          >
                            <Pressable w="100%" h="100%">
                              <Icon
                                color="brand.500"
                                as={FontAwesome5}
                                name="plus"
                                size="6"
                              />
                            </Pressable>
                          </Center>
                        ) : null}
                      </Box>
                      <Stack p={6} space={3}>
                        <Heading
                          style={{
                            textShadowColor: "rgba(0, 0, 0, 0.25)",
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 2,
                          }}
                          color="white"
                          size="md"
                          ml="-1"
                        >
                          {item.name}
                        </Heading>
                        {categoriesString !== undefined && (
                          <HStack space="2" alignItems="flex-start">
                            <Icon
                              as={FontAwesome5}
                              name="star"
                              size="5"
                              color="white"
                              textAlign="center"
                            />
                            <Text
                              style={{
                                textShadowColor: "rgba(0, 0, 0, 0.25)",
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2,
                                flexShrink: 1,
                              }}
                              numberOfLines={2}
                              fontStyle="italic"
                              color="white"
                            >
                              {categoriesString}
                            </Text>
                          </HStack>
                        )}
                        <HStack space="2" alignItems="flex-start">
                          <Icon
                            as={FontAwesome5}
                            name="city"
                            size="5"
                            color="white"
                            textAlign="center"
                          />
                          <Text
                            style={{
                              textShadowColor: "rgba(0, 0, 0, 0.25)",
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                              flexShrink: 1,
                            }}
                            numberOfLines={2}
                            color="white"
                          >
                            {item.city[0].toUpperCase() +
                              item.city.slice(1).toLowerCase()}
                          </Text>
                        </HStack>
                      </Stack>
                    </Box>
                  </Pressable>
                );
              }}
              ListHeaderComponent={() => (
                <Box px={4} alignItems="center">
                  <Input
                    p={4}
                    mb={8}
                    w="100%"
                    shadow={9}
                    variant="rounded"
                    backgroundColor="white"
                    borderColor="transparent"
                    fontSize="md"
                    placeholder="Procurar local..."
                    onChangeText={debouncedInputPlaceHandler}
                    InputLeftElement={
                      <Icon
                        as={Ionicons}
                        name="search-outline"
                        color="gray.400"
                        size={5}
                        ml="4"
                      />
                    }
                    InputRightElement={
                      <Box alignItems="center">
                        {checkActivePlacesFilters !== 0 && (
                          <Badge
                            mb={-5}
                            mr={-1}
                            zIndex="1"
                            variant="solid"
                            rounded="full"
                            colorScheme="brand"
                            alignSelf="center"
                            _text={{
                              fontSize: 10,
                            }}
                          >
                            {checkActivePlacesFilters}
                          </Badge>
                        )}
                        <IconButton
                          colorScheme="brand"
                          rounded="full"
                          _icon={{
                            as: Ionicons,
                            name: "options",
                            size: 5,
                            color: "gray.400",
                          }}
                          onPress={() => navigation.navigate("PlaceFiltering")}
                          mr="4"
                          color="muted.400"
                        />
                      </Box>
                    }
                  />
                  {checkActivePlacesFilters !== 0 && (
                    <Pressable
                      mb="6"
                      onPress={() =>
                        (filtersStore.places = initialPlacesFilter)
                      }
                    >
                      <Text underline color="brand.600">
                        Remover filtros
                      </Text>
                    </Pressable>
                  )}
                </Box>
              )}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default PlacesListScreen;
