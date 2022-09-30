import React from "react";

import { Box, Button, Flex, Text } from "native-base";

import useAchievementIcons, {
  IAchievementIconsKeys,
} from "../AchievementIcons";

const Achievement: React.FC<{
  achievement: IAchievement;
  openAchievementCallback: () => void;
}> = ({ achievement, openAchievementCallback }) => {
  const { name, requirement, difficulty, type } = achievement;
  const icons = useAchievementIcons({ width: 30, height: 30 });

  return (
    <Button
      w="full"
      variant="ghost"
      bgColor="white"
      marginBottom={4}
      borderColor="gray.100"
      py={6}
      onPress={() => openAchievementCallback()}
      style={{
        elevation: 5,
        borderRadius: 35,
        shadowColor: "rgba(40,40,40,0.78)",
      }}
    >
      <Flex
        w="100%"
        flexWrap="wrap"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-around"
      >
        <Flex
          w="50"
          h="50"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          backgroundColor={difficulty.color}
        >
          {icons[type.icon as IAchievementIconsKeys]}
        </Flex>
        <Box w="72%">
          <Text fontSize="lg" fontWeight="bold" numberOfLines={1}>
            {name}
          </Text>
          <Text color="gray.400" fontWeight="light">
            {requirement}
          </Text>
        </Box>
      </Flex>
    </Button>
  );
};

export default Achievement;
