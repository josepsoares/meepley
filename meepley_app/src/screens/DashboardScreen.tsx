import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BackHandler, RefreshControl, useWindowDimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useMutation, useQuery } from "react-query";
import { useSnapshot } from "valtio";
import StarRating from "react-native-star-rating-widget";

import {
  AlertDialog,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Btn from "../components/common/buttons/Btn";
import Emoji from "../components/common/Emoji";
import MatchroomCarousel from "../components/common/MatchroomCarousel";
import BottomTab from "../components/common/navigation/BottomTab";
import ErrorSection from "../components/feedback/ErrorSection";
import Loading from "../components/feedback/Loading";
import Error from "../components/feedback/ErrorScreen";

import MeePleyAPI from "../services/api/meepley";
import authStore from "../services/store/authStore";
import { refreshControlColors } from "../utils/constants/colors";
import mapStyle from "../utils/config/googleMapsThemeConfig.json";
import openUrlInAppBrowser from "../utils/helpers/navigation/openUrlInAppBrowser";
import { StatusBar } from "expo-status-bar";

const colors = ["lYellow.500", "brand.500", "lGreen.500"];

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const [feedback, setFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const feedbackDialogRef = useRef(null);

  const { user: loggedInUser } = useSnapshot(authStore);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetchMatchrooms();
    });

    return unsubscribe;
  }, [navigation]);

  const {
    isLoading: loadingPlaces,
    error: placesError,
    data: placesData,
  } = useQuery("places", MeePleyAPI.places.getPlaces);

  const {
    isLoading: loadingMatchrooms,
    error: matchroomsError,
    data: matchroomsData,
    refetch: refetchMatchrooms,
  } = useQuery("matchrooms", MeePleyAPI.matchrooms.getMatchrooms, {
    enabled: !loggedInUser?.calibrated ? true : false,
    retry: 3,
  });

  const {
    isLoading: loadingRecommendedMatchrooms,
    error: recommendedMatchroomsError,
    data: recommendedMatchroomsData,
    refetch: refetchRecommendedMatchrooms,
  } = useQuery(
    "recommended-matchrooms",
    MeePleyAPI.matchrooms.getRecommendedMatchrooms,
    {
      enabled: loggedInUser?.calibrated ? true : false,
      retry: 3,
    }
  );

  const { data: userMatchroomFeedbackData } = useQuery(
    ["user-feedback", loggedInUser?.id as number],
    ({ signal }) =>
      MeePleyAPI.matchrooms.checkUserMatchroomFeedback(
        loggedInUser?.id as number
      )
  );

  //* user mutation to update their calibration on the db
  const addUserFeedbackMutation = useMutation(
    (data: {
      userId: number;
      matchroomId: number;
      placeId: number;
      rating: number;
    }) => MeePleyAPI.matchrooms.addUserMatchroomFeedback(data),
    {
      onSuccess: () => {
        // console.log("FEEDBACK SUCCESS");
      },
      onError: () => {
        // console.log("FEEDBACK ERROR", err);
      },
    }
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useEffect(() => {
    if (userMatchroomFeedbackData) {
      setFeedback(true);
    }
  }, [userMatchroomFeedbackData]);

  const { width, height } = useWindowDimensions();

  console.log("IS FOCUSED DASHBOARD =>", navigation.isFocused());

  return (
    <>
      <StatusBar backgroundColor="white" />

      <ScrollView
        refreshControl={
          <RefreshControl
            {...refreshControlColors}
            refreshing={refreshing}
            onRefresh={async () => {
              if (loggedInUser?.calibrated) {
                refetchRecommendedMatchrooms();
              } else {
                refetchMatchrooms();
              }
            }}
          />
        }
      >
        <Box w={width} bgColor="white">
          {/* Matchroom Section */}
          <Box pt="8" pb="4">
            {loggedInUser?.calibrated ? (
              <Fragment>
                <Heading px={8} accessibilityRole="header" pb={2}>
                  Partidas abertas
                </Heading>
                {loadingRecommendedMatchrooms ? (
                  <Box px="8">
                    <Loading />
                  </Box>
                ) : recommendedMatchroomsError ? (
                  <Box px="8">
                    <ErrorSection
                      err={recommendedMatchroomsError}
                      custom404Message={
                        <>
                          Não encontramos nenhuma partida aberta{" "}
                          <Emoji size={20} emo="😥" />
                        </>
                      }
                    />
                  </Box>
                ) : recommendedMatchroomsData ? (
                  <>
                    <Text px={8} accessibilityRole="text">
                      Partidas selecionadas especialmente para ti!{" "}
                      <Emoji emo="🎲" />
                    </Text>
                    <MatchroomCarousel matchRooms={recommendedMatchroomsData} />
                  </>
                ) : null}
              </Fragment>
            ) : (
              <Fragment>
                <Heading px={8} accessibilityRole="header" pb={2}>
                  Partidas abertas
                </Heading>

                {loadingMatchrooms ? (
                  <Box w="100%">
                    <Loading />
                  </Box>
                ) : matchroomsError ? (
                  <Box px="8">
                    <ErrorSection
                      err={matchroomsError}
                      custom404Message={
                        <>
                          Não encontramos nenhuma partida aberta{" "}
                          <Emoji size={20} emo="😥" />
                        </>
                      }
                    />
                  </Box>
                ) : matchroomsData ? (
                  <>
                    <Text px="8" pb="2" accessibilityRole="text">
                      Começa já a jogar ao entrar numa das partida disponíveis!{" "}
                      <Emoji emo="🎲" />
                    </Text>
                    <MatchroomCarousel matchRooms={matchroomsData.data} />
                  </>
                ) : null}
              </Fragment>
            )}

            <Btn
              py="2"
              mt="6"
              variant="ghost"
              onPress={() => navigation.navigate("MatchroomsDashboard")}
            >
              Ver o teu painel de partidas
            </Btn>

            <Btn
              py="2"
              variant="ghost"
              onPress={() => navigation.navigate("MatchroomsList")}
            >
              Ver todas as partidas
            </Btn>
          </Box>

          {/* Map with Places Section */}
          <Box px={8} pb={40} pt={8} w="100%">
            <Heading accessibilityRole="header" pb={2}>
              Locais para jogar
            </Heading>

            {loadingPlaces ? (
              <Box w="100%">
                <Loading />
              </Box>
            ) : placesError ? (
              <Error type="500" />
            ) : (
              <>
                <Text accessibilityRole="text">
                  Explora a seleção de locais de referência para jogares em
                  Aveiro!
                </Text>

                <Box
                  shadow="8"
                  style={{
                    borderRadius: 25,
                    overflow: "hidden",
                    marginTop: 30,
                  }}
                >
                  <MapView
                    style={{ width: "100%", height: 300 }}
                    provider={PROVIDER_GOOGLE}
                    mapType="mutedStandard"
                    loadingEnabled={true}
                    loadingIndicatorColor="#A69BEA"
                    customMapStyle={mapStyle}
                    initialRegion={{
                      latitude: 40.642114497340515,
                      longitude: -8.654069429068207,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    {placesData
                      ? placesData.data.map((place, index) => {
                          return (
                            <Marker
                              key={index}
                              title={place.name}
                              coordinate={{
                                latitude: parseFloat(place.latitude),
                                longitude: parseFloat(place.longitude),
                              }}
                              onPress={() =>
                                navigation.navigate("Place", {
                                  place: place,
                                })
                              }
                            >
                              <Flex
                                height="7"
                                width="7"
                                rounded="full"
                                borderWidth={1}
                                alignItems="center"
                                justifyContent="center"
                                borderColor="white"
                                position="relative"
                                backgroundColor="brand.500"
                              >
                                <Icon
                                  size="4"
                                  color="white"
                                  name="location-outline"
                                  as={Ionicons}
                                />
                              </Flex>
                            </Marker>
                          );
                        })
                      : null}
                  </MapView>
                </Box>

                <Text accessibilityRole="text" fontSize="14" pt="8">
                  Sabias que ao jogar boardgames em Aveiro estás a ajudar a
                  cidade para a sua candidatura a Capital Europeia da Cultura em
                  2027? <Emoji size={15} emo="😊" />{" "}
                </Text>

                <Btn
                  mt="2"
                  py="2"
                  variant="ghost"
                  fontSize={14}
                  accessibilityRole="link"
                  accessibilityHint="Abre o link da página da Capital de Cultura de Aveiro de 2027"
                  onPress={() => openUrlInAppBrowser("https://aveiro2027.pt")}
                  leftIcon={
                    <Icon mr="1" size="xs" as={Ionicons} name="open-outline" />
                  }
                >
                  Aveiro 2027
                </Btn>
              </>
            )}
          </Box>
        </Box>
      </ScrollView>

      {userMatchroomFeedbackData && (
        <AlertDialog
          size="lg"
          isOpen={feedback}
          leastDestructiveRef={feedbackDialogRef}
          onClose={() => setFeedback(false)}
          justifyContent="center"
        >
          <AlertDialog.Content px="8" py="8">
            {/* Header of the Dialog */}
            <Avatar
              size="2xl"
              alignSelf="center"
              source={{ uri: userMatchroomFeedbackData?.data?.place?.image }}
            >
              {userMatchroomFeedbackData?.data?.place?.name}
            </Avatar>

            <Heading textAlign="center" fontSize="xl" pt="6" pb="4">
              {userMatchroomFeedbackData?.data?.name}
            </Heading>

            {/* Dialog Content */}
            <Text fontSize="17" pb="1">
              Como avalias a tua experiência e o local desta partida passada?
            </Text>

            <Center alignSelf="center">
              <StarRating
                rating={feedbackRating}
                onChange={setFeedbackRating}
                enableHalfStar={false}
                enableSwiping={false}
              />
            </Center>

            {/* Dialog Footer */}
            <VStack pt="6" justifyContent="center" space="4">
              <Btn
                mx="5"
                variant="solid"
                onPress={() => {
                  setFeedback(false);
                  addUserFeedbackMutation.mutate({
                    userId: loggedInUser?.id as number,
                    matchroomId: userMatchroomFeedbackData?.data?.id,
                    placeId: userMatchroomFeedbackData?.data?.place?.id,
                    rating: feedbackRating,
                  });
                }}
              >
                Avaliar
              </Btn>
              <Button
                px="5"
                ref={feedbackDialogRef}
                variant="ghost"
                colorScheme="brand"
                borderRadius="3xl"
                onPress={() => {
                  setFeedback(false);
                }}
              >
                Saltar avaliação
              </Button>
            </VStack>
          </AlertDialog.Content>
        </AlertDialog>
      )}

      {/* Bottom Navigation Section */}
      <BottomTab />
    </>
  );
};

export default DashboardScreen;
