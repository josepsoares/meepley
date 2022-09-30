import React from "react";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { Box, Flex, Heading, Icon, ScrollView } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import mapStyle from "../../utils/config/googleMapsThemeConfig.json";

// TODO

const aveiroStoreMarkers = [
  {
    latitude: "40.6401998",
    longitude: "-8.650433",
    name: "Fnac - Loja Aveiro",
  },
  {
    latitude: "40.6269603",
    longitude: "-8.6457215",
    name: "Auchan - Aveiro",
  },
  {
    latitude: "40.6269603",
    longitude: "-8.6457215",
    name: "LeYa - Aveiro",
  },
  {
    latitude: "40.6394722",
    longitude: "-8.6501079",
    name: "Titocas Didático",
  },
  {
    latitude: "40.6403521",
    longitude: "-8.653393",
    name: "Bertrand - Aveiro",
  },
];

const bgsPublishersDistributors = [{}, {}, {}, {}, {}, {}];

const bgsCommunities = [{}, {}, {}, {}, {}, {}];

const BgsInPortugalScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="white" />

      <ScrollView>
        <Box px="8" py="10">
          <Heading>Boardgames em Portugal</Heading>
          <Box
            shadow="8"
            style={{
              borderRadius: 25,
              overflow: "hidden",
              marginTop: 30,
            }}
          >
            <MapView
              style={{ width: "100%", height: 300 }}
              provider={PROVIDER_GOOGLE}
              mapType="mutedStandard"
              loadingEnabled={true}
              loadingIndicatorColor="#A69BEA"
              customMapStyle={mapStyle}
              initialRegion={{
                latitude: 40.642114497340515,
                longitude: -8.654069429068207,
                latitudeDelta: 0.01,
                longitudeDelta: 0.0421,
              }}
            >
              {aveiroStoreMarkers.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    title={item.name}
                  >
                    <Flex
                      height="10"
                      width="10"
                      rounded="full"
                      borderWidth={3}
                      alignItems="center"
                      justifyContent="center"
                      borderColor="white"
                      position="relative"
                      backgroundColor="brand.500"
                    >
                      <Icon
                        size="6"
                        color="white"
                        name="map-marker-outline"
                        as={MaterialCommunityIcons}
                      />
                    </Flex>
                  </Marker>
                );
              })}
            </MapView>
          </Box>
        </Box>
      </ScrollView>
    </>
  );
};

export default BgsInPortugalScreen;
