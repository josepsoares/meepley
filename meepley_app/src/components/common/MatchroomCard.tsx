import React from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { Box, Flex, Icon, Image, Pressable, Text } from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "../../theme/utilsStyles";
import { IMatchroom } from "../../ts/interfaces/IMatchroom";

const MatchroomCard: React.FC<{
  item: IMatchroom;
  index: number;
  bgColor: string;
  isActive: boolean;
}> = ({ item, index, bgColor, isActive }) => {
  const navigation = useNavigation();

  console.log(item.scheduled_date);

  return (
    <Pressable
      my="4"
      key={index}
      height="360"
      accessibilityRole="button"
      onPress={() => navigation.navigate("Matchroom", { matchroom: item })}
    >
      <Box height="full" borderRadius="40" bgColor="brand.500">
        <Image
          h="170"
          w="full"
          alt={item.name}
          borderTopRadius="40"
          accessibilityRole="image"
          accessibilityLabel="image"
          resizeMethod="auto"
          resizeMode="contain"
          source={{
            uri: item.image,
          }}
        />
        <Box px={6} pt={4} pb={8}>
          <Text
            pb={2}
            color="white"
            fontWeight={700}
            numberOfLines={1}
            style={styles.textWithShadow}
          >
            {item.name}
          </Text>

          <Flex flexDirection="row" alignItems="center" pb={2}>
            <Icon
              mr="2"
              size="5"
              color="white"
              as={Ionicons}
              name="location-outline"
            />
            <Text
              flexShrink="1"
              color="white"
              numberOfLines={2}
              style={styles.textWithShadow}
            >
              {item.place.name}
            </Text>
          </Flex>

          <Flex flexDirection="row" alignItems="center" pb={2}>
            <Icon
              mr="2"
              size="5"
              color="white"
              as={Ionicons}
              name="calendar-outline"
            />
            <Text color="white" style={styles.textWithShadow}>
              {item.scheduled_date + " às " + item.scheduled_hour}
            </Text>
          </Flex>

          <Flex flexDirection="row" alignItems="center" pb={2}>
            <Icon
              mr="2"
              size="5"
              color="white"
              as={Ionicons}
              name="lock-closed-outline"
            />
            <Text color="white" style={styles.textWithShadow}>
              Privada
            </Text>
          </Flex>
        </Box>
      </Box>
    </Pressable>
  );
};

export default MatchroomCard;
