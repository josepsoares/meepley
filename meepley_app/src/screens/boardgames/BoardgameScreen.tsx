import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "react-query";
import { useSnapshot } from "valtio";

import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Pressable,
  ScrollView,
  Text,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import TextWithIcon from "../../components/common/IconWithText";
import TransparentHeader from "../../components/common/navigation/TransparentHeader";
import ErrorSection from "../../components/feedback/ErrorSection";
import Loading from "../../components/feedback/Loading";

import { StackParamList } from "../../navigation";
import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import openUrlInAppBrowser from "../../utils/helpers/navigation/openUrlInAppBrowser";
import openUrlInExteriorApp from "../../utils/helpers/navigation/openUrlInExteriorApp";
import PrintToast from "../../components/feedback/PrintToast";

type TBoardgameScreenProps = NativeStackScreenProps<
  StackParamList,
  "Boardgame"
>;

const BoardgameScreen = ({ route, navigation }: TBoardgameScreenProps) => {
  const { height } = useWindowDimensions();
  const { boardgameId } = route.params;

  const [showDescription, setShowDescription] = useState(false);
  const [disableFavoriteButton, setDisableFavoriteButton] = useState(false);

  const { isAuth, updateUserProp, user } = useSnapshot(authStore);

  const {
    isLoading,
    error,
    data: bg,
  } = useQuery(
    "bg",
    async () => await MeePleyAPI.boardgames.getBoardgame(+boardgameId)
  );

  const updateFavoriteBoardgame = useMutation(
    async (data: { bgId: number }) =>
      await MeePleyAPI.boardgames.updateFavoriteBoardgame(data.bgId),
    {
      onMutate() {
        setDisableFavoriteButton(true);
      },
      onSettled() {
        setDisableFavoriteButton(false);
      },
      onSuccess(data) {
        updateUserProp("favorite_boardgames", data.data);

        if (data.action === "ADD") {
          PrintToast({
            title: `${bg?.data.name} adicionado aos favoritos com sucesso!`,
            status: "success",
          });
        }
      },
      onError() {
        PrintToast({
          title: "Erro ao adicionar/remover aos favoritos",
          status: "warning",
        });
      },
    }
  );

  return (
    <>
      <StatusBar backgroundColor="white" />
      <SafeAreaView>
        <ScrollView>
          {isLoading ? (
            <Center minHeight={height / 1.5} px={10}>
              <Loading isBgWhite={false} />
            </Center>
          ) : error ? (
            <Box px={8}>
              <ErrorSection err={error} />
            </Box>
          ) : bg?.data !== undefined ? (
            <>
              <Box height={height * 0.4}>
                <TransparentHeader navigation={navigation} />
                <Image
                  accessibilityRole="image"
                  accessibilityLabel="image"
                  source={{
                    uri: bg.data.thumbnail,
                  }}
                  alt={`Imagem do boardgame - ${bg.data.name}`}
                  style={{ width: 400, height: "100%", opacity: 0.7 }}
                />
              </Box>

              <Box
                bgColor="white"
                borderTopRadius="50"
                minHeight={height * 0.6}
                py="8"
                px="8"
                mt="-20"
              >
                <Flex
                  flexWrap="wrap"
                  flexDirection="row"
                  justifyContent="space-between"
                  pb={6}
                >
                  <TextWithIcon
                    w="100%"
                    accLabel="Rating"
                    iconLibrary={Ionicons}
                    iconName="ribbon-outline"
                    text={`Rating de ${bg?.data.bgg_rating}, 1º no BGG`}
                  />
                  <TextWithIcon
                    w="100%"
                    iconLibrary={Ionicons}
                    iconName="calendar-outline"
                    accLabel="Ano lançado"
                    text={`Lançado em ${bg.data.year_released}`}
                  />
                  <TextWithIcon
                    w="100%"
                    iconLibrary={Ionicons}
                    iconName="people-circle-outline"
                    accLabel="Número de jogadores recomendado"
                    text={`${bg.data.min_players}-${bg.data.max_players} jogadores`}
                  />
                  <TextWithIcon
                    w="100%"
                    iconLibrary={Ionicons}
                    iconName="time-outline"
                    accLabel="Duração estimada de partida"
                    text={`${bg.data.avg_playtime} minutos`}
                  />
                  <TextWithIcon
                    w="100%"
                    iconLibrary={Ionicons}
                    iconName="person-outline"
                    accLabel="Idade recomendada"
                    text={`${bg.data.min_age}+ anos`}
                  />
                  <TextWithIcon
                    w="100%"
                    iconLibrary={Ionicons}
                    iconName="star-outline"
                    accLabel="Dificuldade"
                    text={
                      `Jogo ${bg.data.difficulty}` ||
                      "Dificuldade indeterminada"
                    }
                  />
                  {bg.data.categories.length !== 0 ? (
                    <TextWithIcon
                      w="100%"
                      iconLibrary={Ionicons}
                      iconName="flash-outline"
                      accLabel="Géneros"
                      text={[
                        ...bg.data.categories.map(
                          (category) => category.category.name
                        ),
                      ].map((genre, i) =>
                        i === bg.data.categories.length - 1
                          ? genre
                          : `${genre}, `
                      )}
                      fontStyle="italic"
                    />
                  ) : null}
                </Flex>

                <HStack alignItems="center" space={2} pb="2">
                  <Heading mr={2}>{bg.data.name}</Heading>
                  {isAuth ? (
                    <IconButton
                      size="lg"
                      rounded="full"
                      backgroundColor="gray.100"
                      isDisabled={disableFavoriteButton}
                      onPress={() => {
                        updateFavoriteBoardgame.mutate({
                          bgId: bg.data.id,
                        });
                      }}
                      icon={
                        <Icon
                          size="5"
                          as={Ionicons}
                          name={
                            user?.favorite_boardgames.find(
                              (item) => item.boardgame.name === bg.data.name
                            )
                              ? "heart"
                              : "heart-outline"
                          }
                          color={
                            user?.favorite_boardgames.find(
                              (item) => item.boardgame.name === bg.data.name
                            )
                              ? "lRed.400"
                              : "gray.500"
                          }
                        />
                      }
                    />
                  ) : null}

                  {bg.data.official_url !== null ? (
                    <IconButton
                      size="lg"
                      rounded="full"
                      backgroundColor="gray.100"
                      icon={<Icon size="5" as={Ionicons} name="open-outline" />}
                      onPress={() =>
                        WebBrowser.openBrowserAsync(
                          bg.data.official_url as string
                        )
                      }
                    />
                  ) : null}
                </HStack>

                <Text fontStyle="italic" pb="4">
                  {bg.data.short_description}
                </Text>

                <Box pb="6">
                  <Heading size="md" pb="4">
                    Descrição Completa
                  </Heading>
                  <Text
                    pb="4"
                    fontStyle="italic"
                    numberOfLines={!showDescription ? 10 : undefined}
                  >
                    {bg.data.description}
                  </Text>

                  <Btn
                    py="2"
                    w="auto"
                    variant="ghost"
                    leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
                    onPress={() => setShowDescription(!showDescription)}
                  >
                    Ver toda a descrição
                  </Btn>
                </Box>

                <Box>
                  <Heading pb="4">Mais Detalhes</Heading>
                  <Box>
                    {bg.data.designers.length !== 0 && (
                      <>
                        <TextWithIcon
                          w="100%"
                          accLabel="Designer(s)"
                          iconLibrary={Ionicons}
                          iconName="construct-outline"
                          text={`Designer(s): ${bg.data.designers.map(
                            (designer, i) =>
                              bg.data.designers &&
                              i === bg.data.designers.length - 1
                                ? designer
                                : `${designer}, `
                          )}`}
                        />
                      </>
                    )}
                    {bg.data.artists.length !== 0 && (
                      <>
                        <TextWithIcon
                          w="100%"
                          accLabel="Artistas"
                          iconLibrary={Ionicons}
                          iconName="brush-outline"
                          text={`Artista(s): ${bg.data.artists.map(
                            (artist, i) =>
                              i === bg.data.artists.length - 1
                                ? artist
                                : `${artist}, `
                          )}`}
                        />
                      </>
                    )}

                    <TextWithIcon
                      accLabel="Fans"
                      iconLibrary={Ionicons}
                      iconName="people-outline"
                      text={`Fans: ${bg?.data.fans}`}
                    />
                    <TextWithIcon
                      accLabel="Ratings"
                      iconLibrary={Ionicons}
                      iconName="podium-outline"
                      text={`Avaliações: ${bg?.data.nr_of_ratings}`}
                    />
                    <TextWithIcon
                      accLabel="Owned"
                      iconLibrary={Ionicons}
                      iconName="library-outline"
                      text={`Owned: ${bg?.data.owned}`}
                    />
                  </Box>

                  <Btn
                    mt="3"
                    variant="ghost"
                    leftIcon={
                      <Icon
                        mr="2"
                        size="sm"
                        as={Ionicons}
                        name="open-outline"
                      />
                    }
                    onPress={() =>
                      openUrlInAppBrowser(
                        `https://boardgamegeek.com/boardgame/${bg.data.bgg_id}`
                      )
                    }
                  >
                    Ver mais detalhes no BoardGameGeek
                  </Btn>

                  <Divider w="65%" mx="auto" mt="6" mb="12" />

                  <Box>
                    <Heading size="md" pb="4">
                      Como jogar
                    </Heading>

                    <Btn
                      py="2"
                      mx="auto"
                      variant="ghost"
                      textAlign="center"
                      leftIcon={
                        <Icon
                          mr="2"
                          size="sm"
                          as={Ionicons}
                          name="logo-youtube"
                        />
                      }
                      onPress={() => {
                        openUrlInExteriorApp(
                          `vnd.youtube://results?search_query=${bg.data.name}+tutorial`,
                          `https://www.youtube.com/results?search_query=${bg.data.name}+tutorial`
                        );
                      }}
                    >
                      Ver vídeos de tutorials no Youtube
                    </Btn>
                  </Box>

                  <Box pt="6">
                    <Heading size="md" pb="4">
                      Onde comprar
                    </Heading>

                    <Btn
                      py="2"
                      mx="auto"
                      variant="ghost"
                      textAlign="center"
                      leftIcon={
                        <Icon
                          mr="2"
                          size="sm"
                          as={Ionicons}
                          name="open-outline"
                        />
                      }
                      onPress={() => {
                        openUrlInAppBrowser(
                          `https://boardgameprices.co.uk/item/search?search=${bg.data.name}`
                        );
                      }}
                    >
                      Ver no BoardGamePrices
                    </Btn>

                    <Btn
                      py="2"
                      mx="auto"
                      variant="ghost"
                      textAlign="center"
                      leftIcon={
                        <Icon
                          mr="2"
                          size="sm"
                          as={Ionicons}
                          name="open-outline"
                        />
                      }
                      onPress={() => {
                        openUrlInAppBrowser(
                          `https://www.tabletopfinder.eu/en/boardgame/search?query=${bg.data.name}&sortField=relevance`
                        );
                      }}
                    >
                      Ver no TableTopFinder
                    </Btn>
                  </Box>

                  <Pressable pt="3" onPress={() => {}}>
                    <Text textAlign="center" color="brand.500" underline={true}>
                      Carrega aqui a para ver a nossa página dedicada ao setor
                      em Portugal
                    </Text>
                    <Text textAlign="center" color="brand.500" underline={true}>
                      (lojas/distribuidoras)
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </>
          ) : (
            <Text></Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default BoardgameScreen;
