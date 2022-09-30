import React from "react";
import { View } from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// TODO
//* screen for establishments that want to get info from their business
//* which is already in Google Maps API

export default function () {
  return (
    <View style={{ paddingTop: 35, flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails={true}
        renderDescription={(row) => row.description} // custom description render
        onPress={(data, details = null) => {
          // console.log("data", data);
          // console.log("details", details);
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: "AIzaSyCUQoLbBsZz1WWOIQKro8Kx8rzZuZyRPyo",
          language: "en", // language of the results
        }}
        styles={{
          description: {
            fontWeight: "bold",
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
        }}
        //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={
          {
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }
        }
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: "distance",
        }}
        // filterReverseGeocodingByTypes={[
        //   'locality',
        // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={200}
      />
    </View>
  );
}
