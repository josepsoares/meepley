import { Linking } from "react-native";
import openUrl from "./openUrlInBrowser";

const openUrlInExteriorApp = async (
  appUrl: string,
  fallbackHttpsUrl: string
) => {
  const supported = await Linking.canOpenURL(appUrl);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(appUrl);
  } else {
    await openUrl(fallbackHttpsUrl);
  }
};

export default openUrlInExteriorApp;

