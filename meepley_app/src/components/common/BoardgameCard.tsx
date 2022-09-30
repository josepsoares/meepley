import React from "react";
import { useSnapshot } from "valtio";

import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  Pressable,
} from "native-base";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import { IBoardgameMeepley } from "../../ts/interfaces/boardgames/IBoardgame";
import { createMatchroomStore } from "../../services/store/createMatchroomStore";

const BoardgameCard: React.FC<{
  bg: IBoardgameMeepley;
  categories: (string | undefined)[];
  players: string;
  addButton?: boolean;
}> = ({ bg, categories, players, addButton }) => {
  const { boardgames } = useSnapshot(createMatchroomStore);
  const isBoardgameChosen = boardgames.find((item) => item.name === bg.name);

  const categoriesString = categories.map((genre, i) =>
    i === categories.length - 1 ? genre : `${genre}, `
  );

  return (
    <Box
      backgroundColor={
        addButton && isBoardgameChosen ? "lGreen.700" : "brand.500"
      }
      borderRadius="20"
      overflow="hidden"
      shadow={4}
      _dark={{
        borderColor: "coolGray.600",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
    >
      <Box>
        <Image
          w="full"
          h="40"
          accessibilityRole="image"
          accessibilityLabel="image"
          alt={`${bg.name} Image`}
          resizeMode="cover"
          source={{
            uri: bg.thumbnail,
          }}
        />
        {addButton ? (
          <Pressable
            onPress={() => {
              if (isBoardgameChosen) {
                const filteredBgsStore = createMatchroomStore.boardgames.filter(
                  (item) => item.name !== bg.name
                );

                createMatchroomStore.boardgames = filteredBgsStore;
              } else {
                createMatchroomStore.boardgames = [
                  ...createMatchroomStore.boardgames,
                  bg,
                ];
              }
            }}
            alignItems="center"
            justifyContent="center"
            display="flex"
            h="12"
            w="12"
            position="absolute"
            top="4"
            right="4"
            bgColor="white"
            borderRadius="full"
            shadow={4}
            _dark={{
              borderColor: "coolGray.600",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
          >
            <Icon
              color={!isBoardgameChosen ? "brand.500" : "lRed.500"}
              textAlign="center"
              as={FontAwesome5}
              name={!isBoardgameChosen ? "plus" : "times"}
              size="6"
              mx="0"
            />
          </Pressable>
        ) : null}
      </Box>
      <Stack p={6} space={3}>
        <Heading
          style={{
            textShadowColor: "rgba(0, 0, 0, 0.25)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
          color="white"
          size="md"
          ml="-1"
        >
          {bg.name}
        </Heading>
        <HStack space="2">
          <Icon
            as={Ionicons}
            name="people-circle-outline"
            size="5"
            color="white"
            textAlign="center"
          />
          <Text
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.25)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
            color="white"
          >
            {players}
          </Text>
        </HStack>
        {bg?.difficulty && (
          <HStack space="2">
            <Icon
              as={Ionicons}
              name="star-outline"
              size="5"
              color="white"
              textAlign="center"
            />
            <Text
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.25)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
              color="white"
            >
              {bg.difficulty}
            </Text>
          </HStack>
        )}
        {categoriesString.length !== 0 && (
          <HStack space="2" alignItems="flex-start">
            <Icon
              as={Ionicons}
              name="flash-outline"
              size="5"
              color="white"
              textAlign="center"
            />
            <Text
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.25)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                flexShrink: 1,
              }}
              numberOfLines={1}
              fontStyle="italic"
              color="white"
            >
              {categoriesString}
            </Text>
          </HStack>
        )}
      </Stack>
    </Box>
  );
};

export default BoardgameCard;
