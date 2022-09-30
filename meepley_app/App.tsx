import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { AppRegistry, LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
} from "@expo-google-fonts/poppins";

import { QueryClient, QueryClientProvider } from "react-query";
import { useSnapshot } from "valtio";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import {
  extendTheme,
  NativeBaseProvider,
  v3CompatibleTheme,
} from "native-base";

import Navigation from "./src/navigation";
import authStore from "./src/services/store/authStore";
import getTheme from "./src/theme";
import { configsStore } from "./src/services/store/configsStore";
import { nbConfig } from "./src/utils/config/nativeBaseConfig";
import { BRAND_COLOR } from "./src/utils/constants/colors";

import "valtio";
declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

LogBox.ignoreAllLogs(true);

LogBox.ignoreLogs([
  "Setting a timer for a long period of time",
  "ViewPropTypes will be removed from React Native",
  "AsyncStorage has been extracted from react-native",
  "exported from 'deprecated-react-native-prop-types'.",
  "Non-serializable values were found in the navigation state.",
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 }, mutations: { retry: 2 } },
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { hydrated, hydrateStore } = useSnapshot(authStore);
  const { fontSize } = useSnapshot(configsStore);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        //
        // Pre-load fonts, make any API calls you need to do here

        await Font.loadAsync({
          Poppins_400Regular,
          Poppins_400Regular_Italic,
          Poppins_300Light,
          Poppins_300Light_Italic,
          Poppins_500Medium,
          Poppins_500Medium_Italic,
          Poppins_700Bold,
          Poppins_700Bold_Italic,
        });

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    hydrateStore();
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  const theme = getTheme(fontSize);

  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={theme} config={nbConfig}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <Navigation />
          <StatusBar backgroundColor="white" />
        </SafeAreaProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
}

AppRegistry.registerComponent("MeePley", () => App);
