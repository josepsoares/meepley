import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useInfiniteQuery } from "react-query";
import { useSnapshot } from "valtio";
import debounce from "lodash.debounce";

import {
  Pressable,
  Box,
  Input,
  IconButton,
  Icon,
  Spinner,
  Badge,
  Text,
  Center,
} from "native-base";
import { EvilIcons, Ionicons } from "@expo/vector-icons";

import BoardgameCard from "../../components/common/BoardgameCard";
import Loading from "../../components/feedback/Loading";
import ErrorSection from "../../components/feedback/ErrorSection";

import MeePleyAPI from "../../services/api/meepley";
import { filtersStore } from "../../services/store/filtersStore";
import { IBoardgameMeepley } from "../../ts/interfaces/boardgames/IBoardgame";
import { BoardgamesListProps } from "../../ts/types/navigation";
import { refreshControlColors } from "../../utils/constants/colors";
import { initialBoardgamesFilter } from "../../utils/constants/initialFilters";
import checkActiveFiltersLength from "../../utils/helpers/misc/checkActiveFiltersLength";

// import GoToTopButton from "@components/common/buttons/GoToTopButton";

const BoardgamesListScreen: React.FC<BoardgamesListProps> = ({
  navigation,
  route,
}) => {
  const { height } = useWindowDimensions();
  const { previousRoute } = route.params;
  const bgListRef = useRef(null);
  const [showGoToTopBtn, setShowGoToTopBtn] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchBgName, setSearchBgName] = useState("");

  const { bgs: boardgamesFilters } = useSnapshot(filtersStore);
  const checkActiveBoardgamesFilters =
    checkActiveFiltersLength(boardgamesFilters);

  const isChoosingBgsToMatchroom = previousRoute === "createMatchroom";

  const {
    data: bgsList,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery(
    "boardgames",
    ({ pageParam = 0 }) =>
      MeePleyAPI.boardgames.getBoardgamesList(
        pageParam,
        searchBgName,
        boardgamesFilters
      ),
    {
      getNextPageParam: (lastPage) => lastPage.metadata.next_id ?? false,
    }
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const inputBgNameHandler = (text: string) => {
    setSearchBgName(text);
  };

  const debouncedInputBgNameHandler = useMemo(
    () => debounce(inputBgNameHandler, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedInputBgNameHandler.cancel();
    };
  }, []);

  const renderBoardgameListItem: ListRenderItem<IBoardgameMeepley> = ({
    item,
    index,
  }) => {
    return (
      <Pressable
        pb={6}
        key={index}
        onPress={() => {
          if (!isChoosingBgsToMatchroom) {
            navigation.navigate("Boardgame", {
              boardgameId: `${item.id}`,
            });
          }
        }}
      >
        <BoardgameCard
          bg={item}
          players={`${item.min_players}-${item.max_players} jogadores`}
          addButton={isChoosingBgsToMatchroom}
          categories={[
            ...item.categories.map((category) => category.category.name),
          ]}
        />
      </Pressable>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />

      <Box minHeight={height} backgroundColor="#FAFAFA">
        {isLoading ? (
          <Center minHeight={height / 1.5} px={10}>
            <Loading isBgWhite={false} />
          </Center>
        ) : error ? (
          <Box px={8}>
            <ErrorSection err={error} />
          </Box>
        ) : (
          <>
            <FlatList
              contentContainerStyle={{ padding: 40, paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  {...refreshControlColors}
                  refreshing={refreshing}
                  onRefresh={() => refetch()}
                />
              }
              ref={bgListRef}
              data={bgsList?.pages
                .map((page) => page.data.map((bg) => bg))
                .flat()}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={renderBoardgameListItem}
              onEndReached={loadMore}
              onEndReachedThreshold={0.3}
              onScroll={(event) => {
                setShowGoToTopBtn(
                  event.nativeEvent.contentOffset.y > 500 ? true : false
                );
              }}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <Spinner color="emerald.500" size="lg" />
                ) : null
              }
              ListHeaderComponent={
                <Box px={4} alignItems="center">
                  <Input
                    p={4}
                    mb={8}
                    w="100%"
                    shadow={9}
                    fontSize="md"
                    variant="rounded"
                    backgroundColor="white"
                    borderColor="transparent"
                    placeholder="Procurar jogo..."
                    onChangeText={debouncedInputBgNameHandler}
                    InputLeftElement={
                      <Icon
                        as={Ionicons}
                        color="gray.400"
                        name="search-outline"
                        size="5"
                        ml="4"
                      />
                    }
                    InputRightElement={
                      <Box alignItems="center">
                        {checkActiveBoardgamesFilters !== 0 && (
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
                            {checkActiveBoardgamesFilters}
                          </Badge>
                        )}
                        <IconButton
                          mr="4"
                          rounded="full"
                          color="muted.400"
                          colorScheme="brand"
                          _icon={{
                            size: 5,
                            as: Ionicons,
                            name: "options",
                            color: "gray.400",
                          }}
                          onPress={() =>
                            navigation.navigate("BoardgameFiltering")
                          }
                        />
                      </Box>
                    }
                  />
                  {checkActiveBoardgamesFilters !== 0 && (
                    <Pressable
                      mb="6"
                      onPress={() =>
                        (filtersStore.bgs = initialBoardgamesFilter)
                      }
                    >
                      <Text underline color="brand.600">
                        Remover filtros
                      </Text>
                    </Pressable>
                  )}
                </Box>
              }
            />
            {/* <GoToTopButton ref={bgListRef} isVisible={showGoToTopBtn} /> */}
          </>
        )}
      </Box>
    </>
  );
};

export default BoardgamesListScreen;
