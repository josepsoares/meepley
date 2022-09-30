import React, { Fragment, useEffect, useState } from "react";
import {
  BackHandler,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "react-query";
import { useSnapshot } from "valtio";
import Carousel from "react-native-snap-carousel";

import {
  View,
  Center,
  HStack,
  Avatar,
  Text,
  ScrollView,
  Box,
  Heading,
  Icon,
  Pressable,
  Image,
  Flex,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import Achievement from "../../components/common/buttons/Achievement";
import Btn from "../../components/common/buttons/Btn";
// import CollectableCard from "../../components/common/CollectableCard";
import Emoji from "../../components/common/Emoji";
import Loading from "../../components/feedback/Loading";
import Error from "../../components/feedback/ErrorSection";
import useCardAttributesIcons, {
  ICardAttributesIconsKeys,
} from "../../components/common/CardAttributesIcons";

import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import { ProfileProps } from "../../ts/types/navigation";
import { refreshControlColors } from "../../utils/constants/colors";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen: React.FC<ProfileProps> = ({ route, navigation }) => {
  const { profile } = route.params;
  const { height } = useWindowDimensions();

  const { user: currentUser } = useSnapshot(authStore);
  const isUserLoggedInProfile = currentUser?.id === profile.id;

  const [refreshing, setRefreshing] = useState(false);
  const [follow, setFollow] = useState(false);

  const {
    isLoading,
    error,
    data: user,
    refetch,
  } = useQuery("user", () => MeePleyAPI.users.getUserProfile(profile.id), {
    onSuccess: () => setRefreshing(false),
    enabled: !isUserLoggedInProfile,
  });

  const userProfile = isUserLoggedInProfile ? currentUser : user?.data;

  const [sliderCardsActiveItem, setSliderCardsActiveItem] = useState(1);
  const [sliderFavBgsActiveItem, setSliderFavBgsActiveItem] = useState(1);
  const { width: viewportWidth } = useWindowDimensions();

  const sliderWidth = viewportWidth;
  const ITEM_WIDTH = Math.round(sliderWidth * 0.65);

  let sliderRef;
  let sliderCardsRef;

  const attributeIcons = useCardAttributesIcons({ width: 15, height: 15 });

  console.log("HISTORY =>", navigation.getState(), navigation.isFocused());

  useEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();

        return null;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView
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
      >
        <Box py={10} minH={height} backgroundColor="white">
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Error err={error} />
          ) : (
            <>
              <Center pb="6">
                <Avatar
                  size={40}
                  shadow={4}
                  source={{ uri: userProfile?.avatar }}
                >
                  {userProfile?.username}
                </Avatar>
                <Heading pt={6}>{userProfile?.name}</Heading>
                <Text fontSize="md" pt={2}>
                  {userProfile?.username}
                </Text>
                {userProfile?.title !== "" && (
                  <HStack
                    justifyContent="center"
                    alignItems="center"
                    space={2}
                    pt={2}
                  >
                    <Icon
                      as={Ionicons}
                      name="trophy-outline"
                      size={6}
                      color="gold"
                    />
                    <Text color="lYellow.500" fontWeight="bold">
                      {userProfile?.title}
                    </Text>
                  </HStack>
                )}
              </Center>

              {isUserLoggedInProfile ? (
                <Btn
                  px="8"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={
                    <Icon
                      mr={1}
                      size={5}
                      name="create-outline"
                      as={Ionicons}
                      color="white"
                    />
                  }
                  onPress={() => navigation.navigate("EditProfile")}
                >
                  Editar Perfil
                </Btn>
              ) : (
                <Center mt={6}>
                  <HStack space={2}>
                    <Btn
                      colorScheme="brand"
                      variant={!follow ? "outline" : "solid"}
                      onPress={() => setFollow(!follow)}
                      leftIcon={
                        <Icon
                          mr={1}
                          size={5}
                          as={Ionicons}
                          color="brand.500"
                          name="person-add-outline"
                        />
                      }
                    >
                      {!follow ? "Seguir" : "Deixar de Seguir"}
                    </Btn>
                  </HStack>
                </Center>
              )}

              <Box
                px="8"
                pt={10}
                flexDirection="row"
                alignContent="center"
                justifyContent="center"
              >
                {/* Matches Played */}
                <View>
                  <Heading textAlign="center">
                    {userProfile?.matches_played}
                  </Heading>
                  <Text textAlign="center" color="rgba(187,186,186,0.97)">
                    Partidas
                  </Text>
                </View>

                {/* Divider */}
                <Box
                  style={{ width: 0.4 }}
                  h="full"
                  mx={8}
                  bgColor="gray.300"
                />

                <Box>
                  <Heading textAlign="center">
                    {userProfile?.follower?.length}
                  </Heading>
                  <Text textAlign="center" color="rgba(187,186,186,0.97)">
                    Seguidores
                  </Text>
                </Box>
              </Box>

              {/* Achievements */}
              <Box px="8" pt={10}>
                <Heading pb={4}>Proezas</Heading>
                {userProfile?.achievements.length ? (
                  <Box>
                    {userProfile?.achievements.slice(0, 4).map((item) => {
                      return (
                        <Fragment key={item.achievement.id}>
                          <Achievement
                            achievement={item.achievement as IAchievement}
                            openAchievementCallback={() => {
                              // setOpenAchievement(achievement);
                              // setModalVisible(!modalVisible);
                            }}
                          />
                        </Fragment>
                      );
                    })}
                  </Box>
                ) : isUserLoggedInProfile ? (
                  <Text>
                    Ainda não conquistaste nenhuma proeza <Emoji emo="😔" />
                  </Text>
                ) : (
                  <Text>
                    {userProfile?.name} ainda não desbloqueou nenhuma proeza{" "}
                    <Emoji emo="😔" />
                  </Text>
                )}
                <Btn
                  mt="5"
                  py="2"
                  variant="ghost"
                  accessibilityRole="button"
                  accessibilityHint="Carrega no botão para ir para a página de catálogo de achievements"
                  onPress={() =>
                    navigation.navigate("AchievementsList", {
                      unlocked:
                        userProfile?.achievements === undefined
                          ? []
                          : [
                              ...userProfile.achievements.map(
                                (item) => item.achievement
                              ),
                            ],
                    })
                  }
                >
                  Ver todas as proezas
                </Btn>
              </Box>

              {/* Cards */}
              <Box pt="10">
                <Heading px="8" pb="6">
                  Cartas
                </Heading>
                {userProfile?.cards.length ? (
                  <Carousel
                    ref={(c) => (sliderCardsRef = c)}
                    data={userProfile.cards.slice(0, 4)}
                    renderItem={({ item, index }) => {
                      const isActive = sliderCardsActiveItem === index;

                      return (
                        <Pressable pb="6" key={index} onPress={() => {}}>
                          <Flex
                            mb="4"
                            py="2"
                            w="full"
                            borderRadius="30"
                            justifyContent="center"
                            alignItems="center"
                            style={{ elevation: 2 }}
                            bg={{
                              linearGradient: {
                                colors: item.card.rarity.gradient,
                                start: [0, 1],
                                end: [1, 0],
                              },
                            }}
                          >
                            <Box w="96%">
                              <Image
                                borderTopRadius="30"
                                accessibilityRole="image"
                                accessibilityLabel="image"
                                source={require("../../assets/images/placeholder.png")}
                                alt={`${item.card.name} Imagem`}
                                w="full"
                                h="40"
                                resizeMode="cover"
                              />
                              <Box
                                pt="4"
                                pb="6"
                                px="6"
                                mt="-6"
                                w="full"
                                bgColor="white"
                                borderRadius="30"
                              >
                                <HStack
                                  mt="-8"
                                  pb="4"
                                  w="100%"
                                  justifyContent="center"
                                  alignItems="center"
                                  space="1"
                                >
                                  {item.card.attributes.map((attr, i) => (
                                    <Center
                                      key={i}
                                      bgColor={attr.attribute.color}
                                      h="10"
                                      w="10"
                                      borderColor="white"
                                      borderRadius="full"
                                      borderWidth="2"
                                    >
                                      {
                                        attributeIcons[
                                          attr.attribute.name.toLowerCase() as ICardAttributesIconsKeys
                                        ]
                                      }
                                    </Center>
                                  ))}
                                </HStack>
                                <Heading fontSize="lg" textAlign="center">
                                  {item.card.name}
                                </Heading>
                              </Box>
                            </Box>
                          </Flex>
                        </Pressable>
                      );
                    }}
                    sliderWidth={sliderWidth}
                    itemWidth={ITEM_WIDTH}
                    firstItem={0}
                    inactiveSlideScale={0.8}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={0}
                    autoplay={false}
                    activeSlideAlignment="center"
                    onSnapToItem={(index) => setSliderCardsActiveItem(index)}
                  />
                ) : isUserLoggedInProfile ? (
                  <Text px="8">
                    Ainda não tens nenhuma carta <Emoji emo="😔" />
                  </Text>
                ) : (
                  <Text px="8">
                    {userProfile?.name} ainda não possuí nenhuma carta{" "}
                    <Emoji emo="😔" />
                  </Text>
                )}

                <Btn
                  mt="5"
                  py="2"
                  variant="ghost"
                  accessibilityRole="button"
                  accessibilityHint="Carrega no botão para ir para a página de catálogo de cartas"
                  onPress={() =>
                    navigation.navigate("CardsList", {
                      unlocked:
                        userProfile?.cards === undefined
                          ? []
                          : [...userProfile.cards.map((item) => item.card)],
                    })
                  }
                >
                  Ver todas as cartas
                </Btn>
              </Box>

              {/* Favorite Games */}
              <Box pt="10">
                <Heading px="8" pb="4">
                  Jogos favoritos
                </Heading>
                {userProfile?.favorite_boardgames.length ? (
                  <>
                    <Carousel
                      ref={(c) => (sliderRef = c)}
                      data={userProfile.favorite_boardgames.slice(0, 7)}
                      renderItem={({ item, index }) => {
                        const isActive = sliderFavBgsActiveItem === index;

                        return (
                          <Box
                            width={Math.round(sliderWidth * 0.65)}
                            key={item.boardgame.id}
                            backgroundColor="brand.500"
                            borderRadius="20"
                            overflow="hidden"
                          >
                            <Image
                              w="full"
                              h="32"
                              accessibilityRole="image"
                              accessibilityLabel="image"
                              alt={`${item.boardgame.name} cover image`}
                              resizeMode="cover"
                              source={{
                                uri: item.boardgame.thumbnail,
                              }}
                            />
                            <Heading
                              py="4"
                              mx="auto"
                              color="white"
                              size="md"
                              style={{
                                textShadowColor: "rgba(0, 0, 0, 0.25)",
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2,
                              }}
                            >
                              {item.boardgame.name}
                            </Heading>
                          </Box>
                        );
                      }}
                      sliderWidth={sliderWidth}
                      itemWidth={ITEM_WIDTH}
                      firstItem={0}
                      inactiveSlideScale={0.8}
                      inactiveSlideOpacity={0.4}
                      inactiveSlideShift={0}
                      autoplay={false}
                      activeSlideAlignment="center"
                      onSnapToItem={(index) => setSliderFavBgsActiveItem(index)}
                    />

                    {userProfile?.favorite_boardgames.length > 8 ? (
                      <Btn
                        mt="5"
                        py="2"
                        variant="ghost"
                        accessibilityRole="button"
                        onPress={() =>
                          navigation.navigate("ProfileFavoriteBoardgamesList")
                        }
                      >
                        Ver todos os jogos favoritos
                      </Btn>
                    ) : null}
                  </>
                ) : isUserLoggedInProfile ? (
                  <Text px="8">
                    Ainda não adicionaste nenhum boardgame à tua lista de
                    favoritos <Emoji emo="😔" />
                  </Text>
                ) : (
                  <Text px="8">
                    {userProfile?.name} ainda não adicionou nenhum boardgame à
                    sua lista de favoritos <Emoji emo="😔" />
                  </Text>
                )}
              </Box>

              {/* If it is the user logged in show the users they follow */}
              {isUserLoggedInProfile ? (
                <Box px="8" pt={10}>
                  <Heading pb={4}>Quem segues</Heading>
                  <HStack space={4}>
                    {userProfile?.following?.length ? (
                      <>
                        {userProfile?.following
                          .slice(0, 7)
                          .map((following, i) => (
                            <TouchableOpacity key={i} onPress={() => {}}>
                              {/* <Center
                              style={{ height: 80, width: 80 }}
                              rounded="full"
                              borderWidth="4"
                              borderColor="brand.500"
                            >
                              <Avatar
                                h="97%"
                                w="97%"
                                borderWidth={2}
                                borderColor="#FAFAFA"
                                source={following.avatar}
                              />
                            </Center> */}
                            </TouchableOpacity>
                          ))}

                        {userProfile?.following?.length > 8 ? (
                          <Btn
                            mt="5"
                            py="2"
                            variant="ghost"
                            accessibilityRole="button"
                            onPress={() =>
                              navigation.navigate("ProfileFollowersListScreen")
                            }
                          >
                            Ver todos os utilizadores que segues
                          </Btn>
                        ) : null}
                      </>
                    ) : (
                      <Text w="100%">
                        Ainda não estás a seguir nenhum utilizador{" "}
                        <Emoji emo="😔" />
                      </Text>
                    )}
                  </HStack>
                </Box>
              ) : null}
            </>
          )}
        </Box>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
