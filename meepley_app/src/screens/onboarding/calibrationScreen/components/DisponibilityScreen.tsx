import React from "react";
import { useSnapshot } from "valtio";

import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Heading,
  ScrollView,
  Text,
} from "native-base";

import Emoji from "../../../../components/common/Emoji";
import calibrationStore from "../../../../services/store/calibrationStore";
import days from "../../../../utils/constants/days";

const DisponibilityScreen = () => {
  const { selectedDays } = useSnapshot(calibrationStore);

  return (
    <ScrollView>
      <Flex
        px={8}
        mt={10}
        mb={6}
        direction="column"
        textAlign="center"
        backgroundColor="white"
      >
        <Heading textAlign="center">
          Disponibilidade{"  "}
          <Emoji size={25} emo="⌚" />
        </Heading>

        <Text pt={8} textAlign="center">
          Escolhe os dias da semana que tens disponibilidade para jogar
        </Text>

        <Checkbox.Group
          pt={8}
          mx="auto"
          width="75%"
          value={selectedDays as string[]}
          accessibilityLabel="Escolher dias da semana"
          onChange={(values) => {
            calibrationStore.selectedDays = values || [];
          }}
        >
          {days.map((dispItem, dispI) => {
            //* check if the item on the iteration is the last one
            //* this is print or not print a divider in each iteration
            const lastI = days && days.length - 1;

            return (
              <React.Fragment key={dispI}>
                <Box h={16} width="100%" justifyContent="center">
                  <Checkbox
                    my={2}
                    colorScheme="brand"
                    value={
                      typeof dispItem === "string"
                        ? dispItem.toLowerCase()
                        : `${dispI}`
                    }
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      marginRight: 20,
                    }}
                    _text={{
                      color: "gray.400",
                      textAlign: "center",
                    }}
                  >
                    {dispItem}
                  </Checkbox>
                </Box>
                {lastI !== dispI && <Divider width="100%" />}
              </React.Fragment>
            );
          })}
        </Checkbox.Group>
      </Flex>
    </ScrollView>
  );
};

export default DisponibilityScreen;
