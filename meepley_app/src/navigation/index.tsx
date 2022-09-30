import React from "react";
import { useSnapshot } from "valtio";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { getHeaderTitle } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import AppHeader from "../components/common/navigation/Header";
import LogoTitle from "../components/common/navigation/LogoTitleHeader";
import Loading from "../components/feedback/Loading";

//* screens
import AchievementsListScreen from "../screens/AchievementsListScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import BoardgameScreen from "../screens/boardgames/BoardgameScreen";
import BoardgamesListScreen from "../screens/boardgames/BoardgamesListScreen";
import CardsListScreen from "../screens/CardsListScreen";
import ChatScreen from "../screens/matchroom/MatchroomChatScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AchievementFilteringScreen from "../screens/filtering/AchievementFilteringScreen";
import BoardgameFilteringScreen from "../screens/filtering/BoardgameFilteringScreen";
import CardFilteringScreen from "../screens/filtering/CardFilteringScreen";
import MatchroomFilteringScreen from "../screens/filtering/MatchroomFilteringScreen";
import PlaceFilteringScreen from "../screens/filtering/PlaceFilteringScreen";
import CreateMatchroomScreen from "../screens/matchroom/CreateMatchroomScreen";
import MatchroomScreen from "../screens/matchroom/MatchroomScreen";
import MatchroomsDashboardScreen from "../screens/matchroom/MatchroomsDashboardScreen";
import MatchroomsListScreen from "../screens/matchroom/MatchroomsListScreen";
import NotFoundScreen from "../screens/misc/NotFoundScreen";
import PlaceDashboardScreen from "../screens/places/PlaceDashboardScreen";
import PlaceScreen from "../screens/places/PlaceScreen";
import PlacesListScreen from "../screens/places/PlacesListScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProfileFavoriteBoardgamesListScreen from "../screens/profile/ProfileFavoriteBoardgamesListScreen";
import ProfileFollowersListScreen from "../screens/profile/ProfileFollowersListScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import SettingsScreen from "../screens/misc/SettingsScreen";
import UtilitiesScreen from "../screens/misc/UtilitiesScreen";
import OnboardingInitialScreen from "../screens/onboarding/initialScreen/OnboardingInitialScreen";
import OnboardingCalibrationScreen from "../screens/onboarding/calibrationScreen/OnboardingCalibrationScreen";
import BgsInPortugalScreen from "../screens/misc/BgsInPortugalScreen";
import AboutUsScreen from "../screens/misc/AboutUsScreen";
import ReportBugsScreen from "../screens/misc/ReportBugsScreen";

import authStore from "../services/store/authStore";
import LinkingConfiguration from "../utils/config/linkingConfig";

//* types
import { IMatchroom } from "../ts/interfaces/IMatchroom";
import { IPlace } from "../ts/interfaces/IPlace";
import { IUser } from "../ts/interfaces/IUser";
import { Box, Flex } from "native-base";
import { useWindowDimensions } from "react-native";

//* this is not being used
//* https://stackoverflow.com/questions/70725753/the-action-navigate-with-payload-namehome-was-not-handled-by-any-naviga
//* https://reactnavigation.org/docs/navigating-without-navigation-prop/
export const navigationRef = createNavigationContainerRef();
export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    if (params) {
      navigationRef.navigate(name, params);
    } else {
      navigationRef.navigate(name);
    }
  }
}

//* navigation wrapper component
export default function Navigation() {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: "white" },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

//* types of the RootNavigator
export type StackParamList = {
  CalibrationOnboarding: undefined;
  CreateMatch: undefined;
  MatchroomsDashboard: undefined;
  MatchroomsList: undefined;
  Matchroom: { matchroom: IMatchroom };
  MatchroomChatScreen: {
    matchroomId: number;
  };
  Profile: { profile: IUser | { id: number }; username: string };
  ProfileFavoriteBoardgamesList: undefined;
  ProfileFollowersListScreen: undefined;
  EditProfile: undefined;
  Dashboard: undefined;
  Place: {
    place: IPlace;
  };
  DashboardPlace: undefined;
  Settings: undefined;
  InitialOnboarding: undefined;
  Login: undefined;
  Register: undefined;
  BoardgamesList: {
    previousRoute?: string;
  };
  Boardgame: {
    boardgameId: string;
  };
  BgsInPortugal: undefined;
  Utilities: undefined;
  Modal: undefined;
  NotFound: undefined;
  CardsList: { unlocked: ICard[] | [] };
  AchievementsList: { unlocked: IAchievement[] | [] };
  PlacesList: {
    previousRoute?: string;
    initialData?: IPlace[];
  };
  BoardgameFiltering: undefined;
  MatchroomFiltering: undefined;
  PlaceFiltering: undefined;
  AchievementFiltering: undefined;
  CardFiltering: undefined;
  AboutUs: undefined;
  ReportBugs: undefined;
};

//* A root stack navigator is often used for displaying modals on top of all other content.
//*  https://reactnavigation.org/docs/modal
const Stack = createNativeStackNavigator<StackParamList>();

/* const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Editar Perfil", headerBackVisible: true }}
      />
    </ProfileStack.Navigator>
  );
}; */

function RootNavigator() {
  const { isAuth, isLoading, user } = useSnapshot(authStore);
  const { height } = useWindowDimensions();

  if (isLoading) {
    //* checking if user is authenticated
    return (
      <Flex justifyContent="center" alignItems="center" h={height}>
        <Loading />
      </Flex>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuth ? "Dashboard" : "InitialOnboarding"}
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        header: ({ navigation, route, options, back }) => {
          console.log(navigation.isFocused());
          const title = getHeaderTitle(options, route.name);

          return (
            <AppHeader
              navigation={navigation}
              options={options}
              back={back}
              title={title}
              isAuth={isAuth}
            />
          );
        },
      }}
    >
      {!isAuth ? (
        <>
          <Stack.Screen
            name="InitialOnboarding"
            component={OnboardingInitialScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          {user?.calibrated === null ? (
            <Stack.Screen
              name="CalibrationOnboarding"
              component={OnboardingCalibrationScreen}
              options={{
                headerTitle: () => <LogoTitle />,
              }}
            />
          ) : null}

          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              headerBackVisible: false,
              headerTitle: () => <LogoTitle />,
            }}
          />

          <Stack.Screen
            name="DashboardPlace"
            component={PlaceDashboardScreen}
            options={{
              headerBackVisible: false,
              headerTitle: () => <LogoTitle />,
            }}
          />

          <Stack.Screen
            name="Place"
            component={PlaceScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CreateMatch"
            component={CreateMatchroomScreen}
            options={{ title: "Criar partida", headerBackVisible: true }}
          />

          <Stack.Screen
            name="Matchroom"
            component={MatchroomScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "Perfil",
              headerBackVisible: true,
            }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Editar Perfil", headerBackVisible: true }}
          />

          <Stack.Screen
            name="ProfileFavoriteBoardgamesList"
            component={ProfileFavoriteBoardgamesListScreen}
            options={{
              title: "Boardgames Favoritos",
              headerBackVisible: true,
            }}
          />

          <Stack.Screen
            name="ProfileFollowersListScreen"
            component={ProfileFollowersListScreen}
            options={{
              title: "Lista de Seguintes",
              headerBackVisible: true,
            }}
          />

          <Stack.Screen
            name="MatchroomChatScreen"
            component={ChatScreen}
            options={{ title: "Chat", headerBackVisible: true }}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Definições", headerBackVisible: true }}
          />

          <Stack.Screen
            name="PlacesList"
            component={PlacesListScreen}
            options={{ title: "Locais", headerBackVisible: true }}
          />

          <Stack.Screen
            name="CardsList"
            component={CardsListScreen}
            options={{ title: "Cartas", headerBackVisible: true }}
          />

          <Stack.Screen
            name="AchievementsList"
            component={AchievementsListScreen}
            options={{ title: "Proezas", headerBackVisible: true }}
          />

          <Stack.Screen
            name="MatchroomsDashboard"
            component={MatchroomsDashboardScreen}
            options={{ title: "Painel de Partidas", headerBackVisible: true }}
          />

          <Stack.Screen
            name="MatchroomsList"
            component={MatchroomsListScreen}
            options={{ title: "Todas as Partidas", headerBackVisible: true }}
          />

          <Stack.Screen
            name="MatchroomFiltering"
            component={MatchroomFilteringScreen}
            options={{ title: "Filtros", headerBackVisible: true }}
          />
          <Stack.Screen
            name="PlaceFiltering"
            component={PlaceFilteringScreen}
            options={{ title: "Filtros", headerBackVisible: true }}
          />
          <Stack.Screen
            name="AchievementFiltering"
            component={AchievementFilteringScreen}
            options={{ title: "Filtros", headerBackVisible: true }}
          />
          <Stack.Screen
            name="CardFiltering"
            component={CardFilteringScreen}
            options={{ title: "Filtros", headerBackVisible: true }}
          />

          <Stack.Screen
            name="ReportBugs"
            component={ReportBugsScreen}
            options={{
              title: "Reportar bug(s)",
              headerBackVisible: true,
            }}
          />
        </>
      )}

      <Stack.Screen
        name="BoardgamesList"
        component={BoardgamesListScreen}
        options={{
          title: "Boardgames",
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="BoardgameFiltering"
        component={BoardgameFilteringScreen}
        options={{ title: "Filtros", headerBackVisible: true }}
      />

      <Stack.Screen
        name="Boardgame"
        component={BoardgameScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Utilities"
        component={UtilitiesScreen}
        options={{
          title: "Utilitários",
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="BgsInPortugal"
        component={BgsInPortugalScreen}
        options={{
          title: "Boardgames em Portugal",
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{
          title: "Sobre Nós",
          headerBackVisible: true,
        }}
      />

      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

/* const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        options={{
          headerLeft,
        }}
        name="Feed"
        component={Feed}
      />
      <Drawer.Screen name="Home" component={Article} />
      <Drawer.Screen
        name="Utilities"
        component={UtilitiesScreen}
        options={{
          title: "Utilitários",
          headerBackVisible: true,
        }}
      />
      <Drawer.Screen
        name="BgsInPortugal"
        component={BgsInPortugalScreen}
        options={{
          title: "Boardgames em Portugal",
          headerBackVisible: true,
        }}
      />
      <Drawer.Screen name="Article" component={AboutUsScreen} />
      <Drawer.Screen
        name="ReportBugs"
        component={ReportBugsScreen}
        options={{
          title: "Reportar bug(s)",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Definições", headerBackVisible: true }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          headerBackVisible: true,
        }}
      />
    </Drawer.Navigator>
  );
} */
