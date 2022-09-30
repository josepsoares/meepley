import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";
import debounce from "lodash.debounce";

import {
  Badge,
  Box,
  Icon,
  IconButton,
  Input,
  Pressable,
  Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import CollectableCard from "../components/common/CollectableCard";
import ErrorSection from "../components/feedback/ErrorSection";
import Loading from "../components/feedback/Loading";

import MeePleyAPI from "../services/api/meepley";
import { filtersStore } from "../services/store/filtersStore";
import { initialCardsFilter } from "../utils/constants/initialFilters";
import checkActiveFiltersLength from "../utils/helpers/misc/checkActiveFiltersLength";
import { refreshControlColors } from "../utils/constants/colors";
import { StackParamList } from "../navigation";

export type CardsListScreenProps = NativeStackScreenProps<
  StackParamList,
  "CardsList"
>;

const CardsListScreen: React.FC<CardsListScreenProps> = ({
  route,
  navigation,
}) => {
  const { cards: cardsFilters } = useSnapshot(filtersStore);
  const { height } = useWindowDimensions();
  const refCardsList = useRef(null);

  const [searchCardName, setSearchCardName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openCard, setOpenCard] = useState<{
    title: string;
    icon: string;
    description: string;
  } | null>(null);

  const inputCardHandler = (text: string) => {
    setSearchCardName(text);
  };

  const debouncedInputCardHandler = useMemo(
    () => debounce(inputCardHandler, 300),
    []
  );

  const {
    isLoading,
    error,
    data: cards,
    refetch,
  } = useQuery(
    ["cards", { name: searchCardName, ...cardsFilters }],
    (filters) => MeePleyAPI.cards.getCards(filters),
    {
      onSettled: () => setRefreshing(false),
    }
  );

  useEffect(() => {
    return () => {
      debouncedInputCardHandler.cancel();
    };
  }, []);

  const checkActiveCardsFilter = checkActiveFiltersLength(cardsFilters);

  const unlockedCards = route.params.unlocked;
  const unlockedCardsIds = [...unlockedCards.map((item) => item.id)];

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />

      <Box minHeight={height} backgroundColor="#FAFAFA">
        {isLoading ? (
          <Box px="8">
            <Loading isBgWhite={false} />
          </Box>
        ) : error ? (
          <Box px="8">
            <ErrorSection err={error} />
          </Box>
        ) : (
          <>
            <FlatList
              contentContainerStyle={{ padding: 32, paddingBottom: 100 }}
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
              ref={refCardsList}
              data={cards?.data.map((card) => card).flat()}
              keyExtractor={(_, index) => index.toString()}
              ListHeaderComponent={() => (
                <Box px="4" alignItems="center">
                  <Input
                    p="4"
                    mb="8"
                    w="100%"
                    shadow="9"
                    variant="rounded"
                    backgroundColor="white"
                    borderColor="transparent"
                    fontSize="md"
                    placeholder="Procurar carta..."
                    onChangeText={debouncedInputCardHandler}
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
                        {checkActiveCardsFilter !== 0 && (
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
                            {checkActiveCardsFilter}
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
                          onPress={() => navigation.navigate("CardFiltering")}
                          mr="4"
                          color="muted.400"
                        />
                      </Box>
                    }
                  />
                  {checkActiveCardsFilter !== 0 && (
                    <Pressable
                      mb="6"
                      onPress={() => (filtersStore.cards = initialCardsFilter)}
                    >
                      <Text underline color="brand.600">
                        Remover filtros
                      </Text>
                    </Pressable>
                  )}
                </Box>
              )}
              renderItem={({ item, index }) => {
                const isUnlocked = unlockedCardsIds.some(
                  (id) => item.id === id
                );

                return (
                  <Pressable pb="6" key={index} onPress={() => {}}>
                    <CollectableCard card={item} unlocked={isUnlocked} />
                  </Pressable>
                );
              }}
            />
          </>
        )}
      </Box>
    </>
  );
};

export default CardsListScreen;
