import React, { useState } from "react";
import {
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "react-query";
import { useSnapshot } from "valtio";
import dayjs from "dayjs";

import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  ScrollView,
  Text,
  HStack,
  VStack,
  Center,
  Stack,
  useClipboard,
  Pressable,
  Divider,
  Icon,
  Fab,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import TextWithIcon from "../../components/common/IconWithText";
import TransparentHeader from "../../components/common/navigation/TransparentHeader";
import MatchroomBottomTab from "./components/MatchroomBottomTab";
import Loading from "../../components/feedback/Loading";
import PrintToast from "../../components/feedback/PrintToast";
import LoadingModal from "../../components/feedback/LoadingModal";
import ErrorSection from "../../components/feedback/ErrorSection";

import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import { MatchroomProps } from "../../ts/types/navigation";
import { refreshControlColors } from "../../utils/constants/colors";
import openUrlInExteriorApp from "../../utils/helpers/navigation/openUrlInExteriorApp";

const MatchroomScreen: React.FC<MatchroomProps> = ({ route, navigation }) => {
  const { matchroom } = route.params;
  const { value, onCopy } = useClipboard();

  const { user } = useSnapshot(authStore);

  const [refreshing, setRefreshing] = useState(false);
  const [isInMatch, setIsInMatch] = useState(
    matchroom.users.some((item) => item.user.id === user?.id)
  );

  const usersThreshold = 9;
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { height } = useWindowDimensions();

  // TODO
  //* do a show/hide accordion logic to the more details boardgame screen
  const [showAboutBgs, setShowAboutBgs] = useState(true);

  const { isLoading, error, data, refetch } = useQuery(
    "matchroom",
    () => MeePleyAPI.matchrooms.getMatchroom(matchroom.id),
    {
      enabled: false,
      onSuccess: (data) => setRefreshing(false),
    }
  );

  const enterMatchroom = useMutation(
    (data: { matchroomId: number; userId: number }) =>
      MeePleyAPI.matchrooms.enterMatchroom(data.matchroomId, data.userId),
    {
      onError: () => {
        // console.log(error);
      },
    }
  );

  const startMatchroom = useMutation(() =>
    MeePleyAPI.matchrooms.update(matchroom.id, { is_ongoing: true })
  );

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            {...refreshControlColors}
            refreshing={refreshing}
            onRefresh={() => refetch}
          />
        }
      >
        {isLoading ? (
          <Center px="8">
            <Loading isBgWhite={false} />
          </Center>
        ) : error ? (
          <Box px="8">
            <ErrorSection err={error} />
          </Box>
        ) : (
          <>
            <Box height={height * 0.5}>
              <TransparentHeader navigation={navigation} />
              <Image
                accessibilityRole="image"
                accessibilityLabel="image"
                source={{ uri: matchroom.image }}
                alt={`${matchroom.name} Imagem`}
                style={{
                  width: 400,
                  height: "100%",
                  opacity: matchroom.private && !isInMatch ? 0.1 : 0.7,
                }}
              />
              {matchroom.private && !isInMatch && (
                <Center position="absolute" top="1/4" left="33.5%">
                  <Icon
                    as={Ionicons}
                    name="lock-closed"
                    color="gray.400"
                    size="32"
                    zIndex="2"
                  />
                </Center>
              )}
            </Box>

            <Flex mt="-20" bgColor="white" borderTopRadius="50">
              {matchroom.private && !isInMatch ? (
                <Box px="10" pb="20" pt="7">
                  <Heading fontSize="2xl" pb="4">
                    {matchroom.name}
                  </Heading>
                  <Text>
                    Esta sala é privada, só poderás entrar na partida com um
                    convite direto ou com um código, ambos as opções só podem
                    ser realizadas pelo administrador da sala
                  </Text>

                  <Pressable py="3" onPress={() => {}}>
                    <Text color="brand.500">
                      Podes verificar se tens convites ou inserir um código de
                      convite no teu dashboard das tuas partidas
                    </Text>
                  </Pressable>
                </Box>
              ) : (
                <>
                  {false ? (
                    <Text pt="8" w="75%" mx="auto" textAlign="center">
                      3 de quatro jogadores precisam de realizar o checkin
                    </Text>
                  ) : null}

                  <Box px="10" pb="20" pt="7">
                    <Heading fontSize="2xl" pb={4}>
                      {matchroom.name}
                    </Heading>

                    <VStack space="1">
                      <Pressable>
                        <TextWithIcon
                          w="100%"
                          iconName="location-outline"
                          iconLibrary={Ionicons}
                          text={matchroom.place.name}
                          accLabel="Localização"
                        />
                      </Pressable>

                      <TextWithIcon
                        w="100%"
                        iconName="calendar-outline"
                        iconLibrary={Ionicons}
                        text={`${dayjs(matchroom.scheduled_date).format(
                          "DD/MM/YYYY"
                        )} - ${matchroom.scheduled_hour}`}
                        accLabel="Horário"
                      />

                      <TextWithIcon
                        w="100%"
                        iconName="time-outline"
                        iconLibrary={Ionicons}
                        text={`${matchroom.estimated_duration}`}
                        accLabel="Duração estimada"
                      />

                      {matchroom.place.minimum_consumption ? (
                        <TextWithIcon
                          w="100%"
                          iconName="logo-euro"
                          iconLibrary={Ionicons}
                          text={`${matchroom.place.minimum_consumption}€ consumo mínimo no local`}
                          accLabel="Consumo minímo"
                        />
                      ) : null}
                    </VStack>

                    {matchroom?.description && (
                      <Box pt="6">
                        <Heading fontSize="lg" pb="2">
                          Descrição da Partida
                        </Heading>
                        <Text>{matchroom.description}</Text>
                      </Box>
                    )}

                    <Box py="8">
                      <Flex pb="4" alignItems="center" flexDirection="row">
                        <Heading pr="2" color="brand.500">
                          Jogadores
                        </Heading>
                        <Center
                          w="16"
                          h="8"
                          ml="1"
                          bgColor="lGreen.100"
                          borderRadius="3xl"
                        >
                          <Text color="lGreen.600">
                            {matchroom?.users.length} / {matchroom.max_players}
                          </Text>
                        </Center>
                      </Flex>
                      <HStack space="4">
                        {matchroom?.users
                          .slice(0, usersThreshold)
                          .map((item) => (
                            <Pressable
                              key={item.user.username}
                              onPress={() =>
                                navigation.navigate("Profile", {
                                  profile: { id: item.user.id },
                                  username: item.user.username,
                                })
                              }
                            >
                              <Center
                                zIndex="1"
                                style={{ height: 80, width: 80 }}
                                rounded="full"
                                borderWidth="4"
                                borderColor={
                                  item.user.id === matchroom.admin.id
                                    ? "yellow.400"
                                    : item.user.id === user?.id
                                    ? "lGreen.400"
                                    : "brand.500"
                                }
                              >
                                {item.user.id === matchroom.admin.id && (
                                  <Center
                                    zIndex="2"
                                    borderRadius="full"
                                    bgColor="yellow.400"
                                    position="absolute"
                                    top="-8"
                                    left="12"
                                    size="7"
                                    shadow="1"
                                  >
                                    <Icon
                                      as={Ionicons}
                                      name="shield-checkmark-outline"
                                      color="white"
                                      size="4"
                                    />
                                  </Center>
                                )}
                                <Avatar
                                  h="97%"
                                  w="97%"
                                  borderWidth={2}
                                  borderColor="#FAFAFA"
                                  source={{ uri: item.user.avatar }}
                                />
                              </Center>
                            </Pressable>
                          ))}
                        {matchroom?.users
                          .slice(usersThreshold, matchroom?.users.length - 1)
                          .map((item) => (
                            <TouchableOpacity
                              key={item.user.username}
                              onPress={() =>
                                navigation.navigate("Profile", {
                                  profile: { id: item.user.id },
                                  username: item.user.username,
                                })
                              }
                            >
                              <Center
                                zIndex="1"
                                style={{ height: 80, width: 80 }}
                                rounded="full"
                                borderWidth="4"
                                borderColor={
                                  item.user.id === matchroom.admin.id
                                    ? "yellow.400"
                                    : item.user.id === user?.id
                                    ? "lGreen.400"
                                    : "brand.500"
                                }
                              >
                                {item.user.id === matchroom.admin.id && (
                                  <Center
                                    zIndex="2"
                                    borderRadius="full"
                                    bgColor="yellow.400"
                                    position="absolute"
                                    top="-8"
                                    left="12"
                                    size="7"
                                    shadow="1"
                                  >
                                    <Icon
                                      as={Ionicons}
                                      name="shield-checkmark-outline"
                                      color="white"
                                      size="4"
                                    />
                                  </Center>
                                )}
                                <Avatar
                                  h="97%"
                                  w="97%"
                                  borderWidth={2}
                                  borderColor="#FAFAFA"
                                  source={{ uri: item.user.avatar }}
                                />
                              </Center>
                            </TouchableOpacity>
                          ))}
                      </HStack>

                      {matchroom.users.length > usersThreshold && (
                        <Btn
                          mt="3"
                          variant="ghost"
                          leftIcon={
                            <Icon
                              mr="2"
                              size="sm"
                              as={Ionicons}
                              name={!showAllUsers ? "add" : "minus"}
                            />
                          }
                          onPress={() =>
                            setShowAllUsers(!showAllUsers ? true : false)
                          }
                        >
                          {!showAllUsers
                            ? "Ver todos os jogadores"
                            : "Ver menos jogadores"}
                        </Btn>
                      )}
                    </Box>

                    <Box>
                      <Heading pb="4" color="brand.500">
                        Sobre o(s) jogo(s)
                      </Heading>

                      {matchroom.boardgames.map((bg, index) => (
                        <Box key={index}>
                          <Heading fontSize="lg" pb="2">
                            {bg.boardgame.name}
                          </Heading>
                          {bg?.boardgame?.short_description ? (
                            <Text fontStyle="italic" pb="4">
                              {bg.boardgame.short_description}
                            </Text>
                          ) : (
                            <Text pb="4">
                              Este boardgame não possuí uma descrição
                            </Text>
                          )}

                          <Box pb="4">
                            <TextWithIcon
                              w="100%"
                              iconLibrary={Ionicons}
                              iconName="calendar-outline"
                              accLabel="Ano lançado"
                              text={`Lançado em ${bg.boardgame.year_released}`}
                            />
                            <TextWithIcon
                              w="100%"
                              iconLibrary={Ionicons}
                              iconName="people-circle-outline"
                              accLabel="Número de jogadores recomendado"
                              text={`${bg.boardgame.min_players}-${bg.boardgame.max_players} jogadores`}
                            />
                            <TextWithIcon
                              w="100%"
                              iconLibrary={Ionicons}
                              iconName="star-outline"
                              accLabel="Dificuldade"
                              text={
                                `Jogo ${bg.boardgame.difficulty}` ||
                                "Dificuldade indeterminada"
                              }
                            />
                          </Box>

                          <Btn
                            py="2"
                            w="100%"
                            variant="ghost"
                            textAlign="center"
                            leftIcon={
                              <Icon mr="2" size="sm" as={Ionicons} name="add" />
                            }
                            onPress={() => {
                              navigation.navigate("Boardgame", {
                                boardgameId: `${bg.boardgame.id}`,
                              });
                            }}
                          >
                            Ver mais detalhes do jogo
                          </Btn>

                          <Btn
                            py="2"
                            pl="4"
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
                                `vnd.youtube://results?search_query=${bg.boardgame.name}+tutorial`,
                                `https://www.youtube.com/results?search_query=${bg.boardgame.name}+tutorial`
                              );
                            }}
                          >
                            Aprender a jogar via Youtube
                          </Btn>

                          {index < matchroom.boardgames.length - 1 && (
                            <Divider my="2" w="80%" mx="auto" />
                          )}
                        </Box>
                      ))}
                    </Box>

                    {isInMatch && (
                      <>
                        <Divider w="75%" mx="auto" my="6" />
                        <Stack pb="16" space="2">
                          {user && user.id === matchroom.admin.id && (
                            <Btn
                              py="2"
                              w="100%"
                              variant="ghost"
                              _text={{
                                textAlign: "center",
                              }}
                              leftIcon={
                                <Icon
                                  mr="2"
                                  size="sm"
                                  as={Ionicons}
                                  name="copy-outline"
                                />
                              }
                              onPress={() => {
                                onCopy(matchroom.invite_code);
                                PrintToast({
                                  title: "Código copiado com sucesso!",
                                  status: "success",
                                  description:
                                    "Cuidado com quem partilhas o código da sala",
                                });
                              }}
                            >
                              Copiar código de convite
                            </Btn>
                          )}

                          {user && user.id === matchroom.admin.id && (
                            <Btn
                              py="2"
                              w="100%"
                              variant="ghost"
                              isDisabled={true}
                              _text={{
                                textAlign: "center",
                              }}
                              leftIcon={
                                <Icon
                                  mr="2"
                                  size="sm"
                                  as={Ionicons}
                                  name="person-add-outline"
                                />
                              }
                              onPress={() => {}}
                            >
                              Convidar conexões
                            </Btn>
                          )}

                          <Center>
                            <Btn
                              py="2"
                              variant="ghost"
                              _text={{
                                textAlign: "center",
                              }}
                              onPress={() => {}}
                            >
                              Abrir Utilitários
                            </Btn>
                          </Center>

                          {user &&
                          user.id === matchroom.admin.id &&
                          !matchroom.is_ongoing ? (
                            <Btn
                              mb="10"
                              mt="8"
                              px="10"
                              variant="solid"
                              onPress={() => {}}
                            >
                              Começar Partida
                            </Btn>
                          ) : null}
                        </Stack>
                      </>
                    )}
                  </Box>
                </>
              )}
            </Flex>
          </>
        )}
      </ScrollView>

      {isInMatch && user ? (
        <MatchroomBottomTab
          userId={user?.id}
          matchroomId={matchroom.id}
          isMatchroomOngoing={matchroom.is_ongoing}
        />
      ) : !matchroom.private ? (
        <Center>
          <Fab
            onPress={() => {
              if (user) {
                enterMatchroom.mutate({
                  matchroomId: matchroom.id,
                  userId: user.id,
                });
                setIsInMatch(true);
              }
            }}
            colorScheme="brand"
            _text={{
              color: "white",
            }}
            px="6"
            renderInPortal={false}
            shadow={2}
            bottom="6"
            right="10"
            alignSelf="center"
            label="Entrar"
            icon={<Icon color="white" as={Ionicons} name="add" />}
          />
        </Center>
      ) : null}

      {!matchroom.private && (
        <LoadingModal
          condition={enterMatchroom.isLoading}
          message={`Espera uns instantes para te adicionarmos na partida - ${matchroom.name}...`}
        />
      )}
    </SafeAreaView>
  );
};

export default MatchroomScreen;
