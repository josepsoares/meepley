import React from "react";
import { StatusBar } from "expo-status-bar";

import { Box, ScrollView, Text } from "native-base";

// TODO - make a simple screen with a FlatList with a remove button in each item
const ProfileFollowersListScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView>
        <Box p="8" backgroundColor="white">
          <Text>Lista de utilizadores que segues</Text>
        </Box>
      </ScrollView>
    </>
  );
};

export default ProfileFollowersListScreen;
