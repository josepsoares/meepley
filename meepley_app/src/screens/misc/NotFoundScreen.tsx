import React from "react";

import { Box, ScrollView } from "native-base";

import Error from "../../components/feedback/ErrorScreen";

const NotFoundScreen = () => {
  return (
    <ScrollView>
      <Box>
        <Error type="400" />
      </Box>
    </ScrollView>
  );
};

export default NotFoundScreen;
