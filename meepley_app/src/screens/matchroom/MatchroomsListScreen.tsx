import React, { useRef, useState } from "react";
import { FlatList, RefreshControl, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Badge,
  Box,
  Icon,
  IconButton,
  Input,
  Text,
  Pressable,
  IInputProps,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import Loading from "../../components/feedback/Loading";
import ErrorSection from "../../components/feedback/ErrorSection";

import MeePleyAPI from "../../services/api/meepley";
import { filtersStore } from "../../services/store/filtersStore";
import checkActiveFiltersLength from "../../utils/helpers/misc/checkActiveFiltersLength";
import { initialMatchroomsFilter } from "../../utils/constants/initialFilters";
import { refreshControlColors } from "../../utils/constants/colors";
import { StackParamList } from "../../navigation";

export type MatchroomsListScreenProps = NativeStackScreenProps<
  StackParamList,
  "MatchroomsList"
>;

const MatchroomsListScreent: React.FC<MatchroomsListScreenProps> = ({
  route,
  navigation,
}) => {
  const { height } = useWindowDimensions();

  const refMatchroomsList = useRef(null);
  const inputRef =
    useRef<
      React.MemoExoticComponent<
        React.ForwardRefExoticComponent<
          IInputProps & React.RefAttributes<unknown>
        >
      >
    >(null);

  const { matchrooms: matchroomsFilters } = useSnapshot(filtersStore);

  const [refreshing, setRefreshing] = useState(false);
  const [searchMatchroomName, setSearchMatchroomName] = useState("");

  const {
    isLoading,
    error,
    data: matchrooms,
    refetch,
  } = useQuery(
    ["all-matchrooms", { name: searchMatchroomName, ...matchroomsFilters }],
    ({ queryKey }) => MeePleyAPI.matchrooms.getMatchrooms(queryKey[1]),
    {
      onSettled: () => setRefreshing(false),
    }
  );

  const checkActiveMatchroomsFilter =
    checkActiveFiltersLength(matchroomsFilters);

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />

      <Box minHeight={height} backgroundColor="#FAFAFA">
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
          ref={refMatchroomsList}
          contentContainerStyle={{ padding: 40, paddingBottom: 100 }}
          data={matchrooms?.data.map((matchroom) => matchroom).flat()}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={() => (
            <Box px="8">
              {isLoading ? (
                <Loading isBgWhite={false} />
              ) : error ? (
                <ErrorSection err={error} />
              ) : (
                <ErrorSection err={{ status: 404 }} />
              )}
            </Box>
          )}
          ListHeaderComponent={() => (
            <Box px="4" alignItems="center">
              <Input
                ref={inputRef}
                p="4"
                mb="8"
                w="100%"
                shadow={9}
                fontSize="md"
                variant="rounded"
                backgroundColor="white"
                borderColor="transparent"
                placeholder="Procurar partida..."
                onChangeText={(text) => {
                  setSearchMatchroomName(text);
                }}
                value={searchMatchroomName}
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
                    {checkActiveMatchroomsFilter !== 0 && (
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
                        {checkActiveMatchroomsFilter}
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
                      onPress={() =>
                        navigation.navigate("AchievementFiltering")
                      }
                      mr="4"
                      color="muted.400"
                    />
                  </Box>
                }
              />
              {checkActiveMatchroomsFilter !== 0 && (
                <Pressable
                  mb="6"
                  onPress={() =>
                    (filtersStore.matchrooms = initialMatchroomsFilter)
                  }
                >
                  <Text underline color="brand.600">
                    Remover filtros
                  </Text>
                </Pressable>
              )}
            </Box>
          )}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                mb="6"
                p="6"
                w="full"
                key={index}
                backgroundColor="white"
                borderColor="gray.100"
                style={{
                  elevation: 5,
                  borderRadius: 35,
                  shadowColor: "rgba(40,40,40,0.78)",
                }}
                onPress={() => {}}
              ></Pressable>
            );
          }}
        />
      </Box>
    </>
  );
};

export default MatchroomsListScreent;
