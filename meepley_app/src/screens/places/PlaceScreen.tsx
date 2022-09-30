import React, { useState } from "react";
import { RefreshControl, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Box,
  Flex,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import Emoji from "../../components/common/Emoji";
import TextWithIcon from "../../components/common/IconWithText";
import MatchroomCarousel from "../../components/common/MatchroomCarousel";
import TransparentHeader from "../../components/common/navigation/TransparentHeader";

import { PlaceProps } from "../../ts/types/navigation";
import { refreshControlColors } from "../../utils/constants/colors";
import printPlaceDays from "../../utils/helpers/misc/printPlaceDays";

const PlaceScreen: React.FC<PlaceProps> = ({ route, navigation }) => {
  // TODO - when redirecting to create matchroom pass the place object in order to
  // TODO - set the same place in the create matchroom form automatically

  const { place } = route.params;
  const { height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  console.log(place.matchrooms);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            {...refreshControlColors}
            refreshing={refreshing}
            onRefresh={() => null}
          />
        }
      >
        {/* Place Image Section + Transparent Header */}
        <Box height={height * 0.5}>
          <TransparentHeader navigation={navigation} />
          <Image
            accessibilityRole="image"
            accessibilityLabel="image"
            source={{ uri: place.image }}
            alt={`${place.name} Imagem`}
            style={{ width: 400, height: "100%", opacity: 0.7 }}
          />
        </Box>

        <Flex
          mt="-20"
          bgColor="white"
          borderTopRadius="50"
          minHeight={height * 0.6}
        >
          {/* Place Details Section */}
          <Box p={10}>
            <Heading accessibilityRole="header" pb={4}>
              {place.name}
            </Heading>
            <VStack space={1}>
              <TextWithIcon
                w="100%"
                accLabel="Localização"
                iconName="location-outline"
                iconLibrary={Ionicons}
                text={place.address}
              />
              <TextWithIcon
                w="100%"
                accLabel="Horário de funcionamento"
                iconName="calendar-outline"
                iconLibrary={Ionicons}
                text={`${printPlaceDays(place.open_days)}*`}
              />
              <TextWithIcon
                w="100%"
                accLabel="Horário de funcionamento"
                iconName="time-outline"
                iconLibrary={Ionicons}
                text={`Aberto das ${place.hours_open}*`}
              />
              <TextWithIcon
                w="100%"
                accLabel="Características"
                iconName="storefront-outline"
                iconLibrary={MaterialCommunityIcons}
                text={place.types.map((item) => item.type.name).join(", ")}
              />
              {place.minimum_consumption && (
                <TextWithIcon
                  w="100%"
                  iconName="attach-money"
                  accLabel="Consumo minímo"
                  iconLibrary={MaterialIcons}
                  text={`${place.minimum_consumption}€ consumo mínimo no local`}
                />
              )}
              <TextWithIcon
                w="100%"
                accLabel="Direções"
                iconName="directions"
                iconLibrary={MaterialCommunityIcons}
                text={"Direções"}
              />
            </VStack>
          </Box>

          <Box>
            {/* Matchroom Section */}
            <Heading accessibilityRole="header" px={10} pb={4}>
              Partidas e Eventos
            </Heading>

            {/* Check if there are actual matches occuring in the place in question */}
            {place.matchrooms.length > 0 ? (
              <MatchroomCarousel
                matchRooms={place.matchrooms.map((item) => ({
                  ...item,
                  place: place,
                }))}
              />
            ) : (
              <Flex
                px={10}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text accessibilityRole="text" mt={2}>
                  Não existe nenhuma partida ou evento de momento neste local,
                  mas ninguém te impede de criar uma partida a partir do botão
                  abaixo <Emoji size={22} emo="👇" />
                </Text>

                <Flex flex={1} alignItems="center">
                  <Btn
                    mt={8}
                    mb={10}
                    width={40}
                    minWidth={40}
                    variant="solid"
                    onPress={() => navigation.navigate("CreateMatch")}
                    accessibilityRole="button"
                    accessibilityHint=""
                    accessibilityLabel=""
                  >
                    Criar partida
                  </Btn>
                </Flex>
              </Flex>
            )}
          </Box>

          <Box>
            {/* Boardgames in the Place Section */}
            <Heading accessibilityRole="header" px={10} pb={4}>
              Jogos de tabuleiro neste local
            </Heading>

            {/* Check if there are actual boardgames in the place in question */}
            {place.boardgames.length > 0 ? (
              <></>
            ) : (
              <Flex
                px={10}
                pb={10}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text accessibilityRole="text" mt={2}>
                  Este local não possuí qualquer jogo de tabuleiro, por isso não
                  te esqueças de trazer os teus <Emoji emo="😛" size={22} />{" "}
                </Text>
              </Flex>
            )}
          </Box>

          <Text fontSize="xs" color="gray.400" px={10} pt={2} pb={8}>
            * Os dias e horas referidas tendo em conta o funcionamento não têm
            em consideração feriados ou época especiais, para mais informações
            visita a página do local em questão
          </Text>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaceScreen;
