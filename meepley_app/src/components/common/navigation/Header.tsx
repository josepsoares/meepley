import React from "react";
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  Modal,
  VStack,
} from "native-base";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import authStore from "../../../services/store/authStore";
import Btn from "../buttons/Btn";

const AppHeader: React.FC<{
  navigation: NativeStackNavigationProp<ParamListBase, string>;
  options: NativeStackNavigationOptions;
  back:
    | {
        title: string;
      }
    | undefined;
  title: string;
  isAuth: boolean;
}> = ({ navigation, options, back, title }) => {
  const { setAuth, isAuth, user } = useSnapshot(authStore);
  const [modalVisible, setModalVisible] = React.useState(false);

  const navigationState = navigation.getState();
  console.log(isAuth);

  return (
    <SafeAreaView>
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          height: 75,
          backgroundColor:
            navigationState.routes[navigationState.routes.length - 1].name ===
              "BoardgamesList" ||
            navigationState.routes[navigationState.routes.length - 1].name ===
              "EditProfile" ||
            navigationState.routes[navigationState.routes.length - 1].name ===
              "CreateMatch" ||
            navigationState.routes[navigationState.routes.length - 1].name ===
              "CardsList" ||
            navigationState.routes[navigationState.routes.length - 1].name ===
              "AchievementsList" ||
            navigationState.routes[navigationState.routes.length - 1].name ===
              "PlacesList"
              ? "#FAFAFA"
              : "transparent",
        }}
      >
        <Center height={10} width={10} ml={4}>
          {back && options.headerBackVisible && (
            <Button
              w="12"
              h="12"
              variant="ghost"
              rounded="full"
              colorScheme="brand"
              onPress={() => navigation.canGoBack() && navigation.goBack()}
            >
              <Icon
                size="7"
                as={Ionicons}
                color="brand.500"
                name="chevron-back"
              />
            </Button>
          )}
        </Center>
        <Box>
          {options?.title ? (
            <Heading color="brand.500" fontSize="lg">
              {options.title}
            </Heading>
          ) : (
            options?.headerTitle &&
            typeof options.headerTitle !== "string" &&
            options.headerTitle({ children: "" }) // @ts-ignore
          )}
        </Box>
        <Flex justifyContent="center" height={8} width={8} mr={8}>
          {isAuth && (
            <IconButton
              w="12"
              h="12"
              rounded="full"
              variant="ghost"
              colorScheme="brand"
              onPress={() => {
                console.log("TESTE");
                setModalVisible(true);
              }}
              _icon={{
                size: "6",
                as: Ionicons,
                color: "brand.500",
                name: "ellipsis-vertical-outline",
                mx: "auto",
                my: "auto",
              }}
            />
          )}
        </Flex>
      </Flex>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content p="4">
          <VStack space="1">
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="person-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() =>
                user &&
                navigation.navigate("Profile", {
                  profile: { id: user.id },
                  username: user.username,
                })
              }
            >
              Perfil
            </Btn>
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="settings-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() => navigation.navigate("Settings")}
            >
              Definições
            </Btn>
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="bug-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() => navigation.navigate("ReportBugs")}
            >
              Reportar bug(s)
            </Btn>
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="log-out-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() => {
                setAuth(false, "logout");
              }}
            >
              Logout
            </Btn>
          </VStack>

          <Divider my="4" w="100%" />

          <VStack space="1">
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="people-circle-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() => navigation.navigate("AboutUs")}
            >
              Sobre nós
            </Btn>
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="location-outline"
                  color="brand.500"
                  size="4"
                  mr="1"
                />
              }
              onPress={() => navigation.navigate("Settings")}
            >
              Aveiro 2027
            </Btn>
            <Btn
              py="2"
              w="100%"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <Icon
                  as={FontAwesome5}
                  name="dice-d20"
                  color="brand.500"
                  size="3"
                  mr="1"
                />
              }
              onPress={() => navigation.navigate("BgsInPortugal")}
            >
              Boardgames em Portugal
            </Btn>
          </VStack>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
};

export default AppHeader;
