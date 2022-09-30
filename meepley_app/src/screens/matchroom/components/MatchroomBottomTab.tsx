import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "react-query";
import Svg, { Path } from "react-native-svg";

import {
  AlertDialog,
  Box,
  Button,
  Center,
  Icon,
  Text,
  Pressable,
  Heading,
  HStack,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import LoadingModal from "../../../components/feedback/LoadingModal";
// import Btn from "../../../components/common/buttons/Btn";

import MeePleyAPI from "../../../services/api/meepley";
import { getPath } from "../../../utils/helpers/misc/getPath";

// TODO
//* refactor styles of this page

const MatchroomBottomTab: React.FC<{
  userId: number;
  matchroomId: number;
  isMatchroomOngoing: boolean;
}> = ({ userId, matchroomId, isMatchroomOngoing }) => {
  const navigation = useNavigation();
  const { width: w } = useWindowDimensions();
  const height = 85;
  const circleWidth = 80;

  const d = getPath(w, height, circleWidth, isMatchroomOngoing);

  const abandonMatchroom = useMutation(
    (data: { matchroomId: number; userId: number }) =>
      MeePleyAPI.matchrooms.abandonMatchroom(data.matchroomId, data.userId),
    {
      onSuccess: () => {
        navigation.navigate("Dashboard");
      },
    }
  );

  const [isAbandonAlertOpen, setIsAbandonAlertOpen] = useState(false);
  const cancelRef = useRef(null);

  const onClose = () => setIsAbandonAlertOpen(false);

  return (
    <>
      <Box alignSelf="center" position="absolute" bottom="0">
        <Svg width={w} height={height}>
          <Path fill="#e4e4e4" stroke="#f0f0f0" strokeWidth={0.75} {...{ d }} />
        </Svg>
        <Box
          position="absolute"
          flexDirection="row"
          justifyContent="space-between"
          style={{ width: w }}
        >
          {!isMatchroomOngoing ? (
            <>
              <Box pb="3" style={[styles.row, { height: height }]}>
                <TouchableOpacity
                  onPress={() => setIsAbandonAlertOpen(true)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    as={Ionicons}
                    name="exit-outline"
                    size={30}
                    color={"#979797"}
                  />
                  <Text mt={1} color="#979797">
                    Abandonar
                  </Text>
                </TouchableOpacity>
              </Box>

              <Pressable
                pb="3"
                alignSelf="flex-end"
                accessibilityRole="button"
                accessibilityLabel="Criar partida"
                onPress={() => {}}
              >
                <Text color="brand.500">Checkin</Text>
              </Pressable>

              <Pressable
                style={{
                  top: -50,
                  right: "40.2%",
                  width: 75,
                  height: 75,
                  elevation: 8,
                  borderRadius: 35,
                }}
                position="absolute"
                accessibilityRole="button"
                accessibilityLabel="Criar partida"
                onPress={() => navigation.navigate("CreateMatch")}
              >
                <Center
                  width="100%"
                  height="100%"
                  rounded="full"
                  style={{ elevation: 2 }}
                  bg={{
                    linearGradient: {
                      colors: ["#eeedf7", "#7e71d3"],
                      start: [0.15, 0.0],
                      end: [0.75, 1.0],
                    },
                  }}
                >
                  <Icon size={10} as={Ionicons} name="add" color="white" />
                </Center>
              </Pressable>

              <Box pb="3" style={[styles.row, { height: height }]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MatchroomChatScreen", {
                      matchroomId: matchroomId,
                    })
                  }
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    as={Ionicons}
                    name="chatbubbles-outline"
                    size={30}
                    color={"#979797"}
                  />
                  <Text mt={1} color="#979797">
                    Chat
                  </Text>
                </TouchableOpacity>
              </Box>
            </>
          ) : (
            <>
              <Box pb="3" style={[styles.row, { height: height }]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MatchroomChatScreen", {
                      matchroomId: matchroomId,
                    })
                  }
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    as={Ionicons}
                    name="chatbubbles-outline"
                    size={30}
                    color={"#979797"}
                  />
                  <Text mt={1} color="#979797">
                    Chat
                  </Text>
                </TouchableOpacity>
              </Box>

              <Box pb="3" style={[styles.row, { height: height }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Utilities")}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    as={Ionicons}
                    name="exit-outline"
                    size={30}
                    color={"#979797"}
                  />
                  <Text mt={1} color="#979797">
                    Utilitários
                  </Text>
                </TouchableOpacity>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAbandonAlertOpen}
        onClose={onClose}
        size="lg"
      >
        <AlertDialog.Content px="6" py="6">
          <Heading fontSize="lg" pb="2">
            Abandonar Partida
          </Heading>

          <Text pb={6}>
            Não poderás voltar a entrar em partidas após 5 minutos
          </Text>

          <HStack justifyContent="flex-end">
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancelar
              </Button>
              <Button
                borderRadius="30"
                colorScheme="danger"
                onPress={() => {
                  onClose();
                  abandonMatchroom.mutate({ matchroomId, userId });
                }}
              >
                Abandonar
              </Button>
            </Button.Group>
          </HStack>
        </AlertDialog.Content>
      </AlertDialog>

      <LoadingModal
        condition={abandonMatchroom.isLoading}
        message={`Espera uns instantes enquanto te removemos da partida...`}
      />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});

export default MatchroomBottomTab;
