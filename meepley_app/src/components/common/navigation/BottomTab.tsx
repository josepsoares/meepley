import React from "react";
import {
  useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { useSnapshot } from "valtio";

import { Box, Center, Icon, Pressable, Text } from "native-base";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import authStore from "../../../services/store/authStore";
import { getPath } from "../../../utils/helpers/misc/getPath";

const BottomTab: React.FC<{ isInsideMatchroom?: boolean }> = ({
  isInsideMatchroom = false,
}) => {
  const navigation = useNavigation();
  const { width: w } = useWindowDimensions();
  const { user } = useSnapshot(authStore);
  const height = 85;
  const circleWidth = 80;

  const d = getPath(w, height, circleWidth, isInsideMatchroom);

  return (
    <Box alignSelf="center" position="absolute" bottom="0">
      <Svg width={w} height={height}>
        <Path fill={"#e4e4e4"} stroke="#f0f0f0" strokeWidth={0.75} {...{ d }} />
      </Svg>
      <Box
        position="absolute"
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: w }}
      >
        <Box pb="3" style={[styles.row, { height: height }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Ir para perfil do utilizador"
            onPress={() => navigation.navigate("MatchroomsDashboard")}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              size={25}
              as={MaterialCommunityIcons}
              color="#979797"
              name="cards-playing-spade-multiple-outline"
            />
            <Text mt={1} color="#979797">
              Partidas
            </Text>
          </TouchableOpacity>
        </Box>

        <Pressable
          pb="3"
          alignSelf="flex-end"
          accessibilityRole="button"
          accessibilityLabel="Criar partida"
          onPress={() => navigation.navigate("CreateMatch")}
        >
          <Text color="brand.500">Criar partida</Text>
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
            accessibilityRole="button"
            accessibilityLabel="Ir para lista de jogos de tabuleiro"
            onPress={() =>
              navigation.navigate("BoardgamesList", {
                previousRoute: "Dashboard",
              })
            }
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name="dice-d20" size={24} color="#979797" />
            <Text mt={1} color="#979797">
              Jogos
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
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

export default BottomTab;
