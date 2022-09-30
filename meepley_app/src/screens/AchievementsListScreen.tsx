import React, { useRef, useState } from "react";
import { FlatList, RefreshControl, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";
import debounce from "lodash.debounce";
import LocationSvg from "../assets/icons/achievements/community.svg";

import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  IInputProps,
  Image,
  Input,
  Modal,
  Pressable,
  Text,
} from "native-base";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";

import Btn from "../components/common/buttons/Btn";
import ErrorSection from "../components/feedback/ErrorSection";
import Loading from "../components/feedback/Loading";

import MeePleyAPI from "../services/api/meepley";
import { filtersStore } from "../services/store/filtersStore";
import { refreshControlColors } from "../utils/constants/colors";
import { initialAchievementsFilter } from "../utils/constants/initialFilters";
import checkActiveFiltersLength from "../utils/helpers/misc/checkActiveFiltersLength";
import onShare from "../utils/helpers/misc/onShare";
import openUrl from "../utils/helpers/navigation/openUrlInBrowser";
import useDebounce from "../utils/hooks/useDebounce";
import { StackParamList } from "../navigation";
import useAchievementIcons, {
  IAchievementIconsKeys,
} from "../components/common/AchievementIcons";

export type AchievementsListScreenProps = NativeStackScreenProps<
  StackParamList,
  "AchievementsList"
>;

const AchievementsListScreen: React.FC<AchievementsListScreenProps> = ({
  route,
  navigation,
}) => {
  const inputRef =
    useRef<
      React.MemoExoticComponent<
        React.ForwardRefExoticComponent<
          IInputProps & React.RefAttributes<unknown>
        >
      >
    >(null);

  const { achievements: achievementsFilters } = useSnapshot(filtersStore);
  const achievementIcons = useAchievementIcons({ width: 65, height: 65 });

  const { height } = useWindowDimensions();
  const refAchievementsList = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [openAchievement, setOpenAchievement] = useState<{
    title: string;
    icon: string;
    description: string;
  } | null>(null);

  const unlockedAchievements = route.params.unlocked;

  const [searchAchievementName, setSearchAchievementName] = useState("");

  const {
    isLoading,
    error,
    data: achievements,
    refetch,
  } = useQuery(
    ["achievements", { name: searchAchievementName, ...achievementsFilters }],
    ({ queryKey }) => MeePleyAPI.achievements.getAchievements(queryKey[1]),
    {
      onSettled: () => setRefreshing(false),
    }
  );

  useDebounce(searchAchievementName, 500);

  const inputAchvHandler = (text: string) => {
    setSearchAchievementName(text);
  };

  /*   useEffect(() => {
    return () => {
      debouncedInputAchvHandler.cancel();
    };
  }, []); */

  const checkActiveAchievementsFilter =
    checkActiveFiltersLength(achievementsFilters);

  const unlockedAchievementIds = [
    ...unlockedAchievements.map((item) => item.id),
  ];

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
          ref={refAchievementsList}
          contentContainerStyle={{ padding: 40, paddingBottom: 100 }}
          data={achievements?.data.map((achv) => achv).flat()}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={() => (
            <Box px={8}>
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
            <Box px={4} alignItems="center">
              <Input
                ref={inputRef}
                p={4}
                mb={8}
                w="100%"
                shadow={9}
                variant="rounded"
                backgroundColor="white"
                borderColor="transparent"
                fontSize="md"
                placeholder="Procurar proeza..."
                onChangeText={(text) => {
                  setSearchAchievementName(text);
                }}
                value={searchAchievementName}
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
                    {checkActiveAchievementsFilter !== 0 && (
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
                        {checkActiveAchievementsFilter}
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
              {checkActiveAchievementsFilter !== 0 && (
                <Pressable
                  mb="6"
                  onPress={() =>
                    (filtersStore.achievements = initialAchievementsFilter)
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
            const isUnlocked = unlockedAchievementIds.some(
              (id) => item.id === id
            );

            console.log(item.type.icon);

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
              >
                {!isUnlocked ? (
                  <Flex position="absolute" left="19%" top="12%">
                    <Icon
                      size="56"
                      zIndex="2"
                      as={Ionicons}
                      name="lock-closed"
                      color="gray.400"
                      opacity="0.85"
                    />
                  </Flex>
                ) : null}

                <Flex
                  mb="5"
                  alignItems="center"
                  justifyContent="center"
                  borderColor="white"
                >
                  <Center
                    h="32"
                    w="32"
                    borderRadius="full"
                    backgroundColor={item.difficulty.color}
                    opacity={item.secret || !isUnlocked ? 0.4 : 1}
                  >
                    {achievementIcons[item.type.icon as IAchievementIconsKeys]}
                  </Center>
                </Flex>

                <Heading
                  opacity={item.secret || !isUnlocked ? 0.4 : 1}
                  textAlign="center"
                >
                  {item.secret ? "Proeza Secreta" : item.name}
                </Heading>

                <Divider my="4" color="gray.500" opacity={1} />

                <Text
                  pb="3"
                  color="gray.500"
                  fontWeight="light"
                  opacity={item.secret || !isUnlocked ? 0.4 : 1}
                >
                  {item.secret
                    ? "Terás de descobrir o objetivo da proeza sozinho..."
                    : item.requirement}
                </Text>
              </Pressable>
            );
          }}
        />
        {openAchievement ? (
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            size="lg"
          >
            <Modal.Content
              px={5}
              pt={5}
              pb={10}
              minH={300}
              shadow={0}
              borderRadius={40}
              textAlign="center"
              backgroundColor="white"
            >
              {/* Header of the Dialog */}
              <Flex
                w="full"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <IconButton
                  variant="ghost"
                  rounded="full"
                  colorScheme="brand"
                  onPress={() => setModalVisible(false)}
                  icon={
                    <Icon
                      size="6"
                      name="close"
                      as={EvilIcons}
                      color="brand.500"
                    />
                  }
                />
              </Flex>

              {/* Dialog Content */}
              <Center pt={2} width="full">
                <Icon
                  size={24}
                  as={AntDesign}
                  color="#FDC500"
                  name={openAchievement?.icon}
                />
              </Center>

              <Heading pt={30} width="full" textAlign="center">
                {openAchievement?.title}
              </Heading>
              <Divider my="5" w="80%" alignSelf="center" />
              <Text width="full" textAlign="center">
                {openAchievement?.description}
              </Text>

              <Center pt={4}>
                <Btn
                  py={3}
                  mb={8}
                  variant="solid"
                  colorScheme="brand"
                  onPress={() =>
                    onShare(
                      `Conquistei a proeza - ${openAchievement?.title} - no MeePley, a plataforma para encontrar jogadores de tabuleiro em Aveiro. Experimenta já e ao fazê-lo estás a ajudar Aveiro na sua candidatura para Capital Europeia da Cultura de 2027 enquanto jogas boardgames! 🤩`
                    )
                  }
                  leftIcon={
                    <Icon
                      size={4}
                      color="white"
                      as={Ionicons}
                      name="ios-share-social-outline"
                    />
                  }
                >
                  Partilhar
                </Btn>
                <Image
                  h="24"
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="image"
                  alt="Aveiro 2027 Capital Europeia da Cultura"
                  source={require("../assets/images/branding/aveiro/aveiro-full-black.png")}
                />
                <Text
                  mt={2}
                  underline
                  color="brand.600"
                  textAlign="center"
                  onPress={async () => await openUrl("https://aveiro2027.pt")}
                >
                  Saber mais
                </Text>
              </Center>
            </Modal.Content>
          </Modal>
        ) : null}
      </Box>
    </>
  );
};

export default AchievementsListScreen;
