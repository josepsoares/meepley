import React from "react";
import { StatusBar } from "expo-status-bar";

import { Box, ScrollView, Text } from "native-base";

// TODO - make a simple screen with a FlatList with a remove button in each item
const ProfileFavoriteBoardgamesListScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView>
        <Box p="8" backgroundColor="white">
          <Text>Lista dos teus boardgames favoritos</Text>
        </Box>
      </ScrollView>
    </>
  );
};

export default ProfileFavoriteBoardgamesListScreen;
