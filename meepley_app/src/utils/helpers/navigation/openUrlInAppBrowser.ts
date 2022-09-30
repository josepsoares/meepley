import * as WebBrowser from "expo-web-browser";

const openUrlInAppBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url);
};

export default openUrlInAppBrowser;

