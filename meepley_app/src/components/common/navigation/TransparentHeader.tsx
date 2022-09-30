import React from "react";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSnapshot } from "valtio";

import { Button, Center, Divider, Flex, Icon, Menu } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import authStore from "../../../services/store/authStore";

const TransparentHeader: React.FC<{
  navigation: NativeStackNavigationProp<ParamListBase, string>;
}> = ({ navigation }) => {
  /**
   * * This component server as a transparent header without any title or logo
   * * It simply contains two buttons, the go back button on the left and
   * * the right button that opens a menu with the option to logout or go to the settings
   * * It's used in the following screens: PlaceScreen, BoardgameScreen, MatchroomScreen
   */
  const { setAuth, isAuth, user } = useSnapshot(authStore);

  return (
    <Flex
      w="100%"
      pt={10}
      zIndex="5"
      direction="row"
      position="absolute"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="transparent"
      style={{
        height: 75,
      }}
    >
      <Center height={8} width={8} ml={8}>
        <Button
          w="12"
          h="12"
          shadow="3"
          rounded="full"
          variant="solid"
          backgroundColor="white"
          onPress={() => navigation.goBack()}
        >
          <Icon size="7" as={Ionicons} color="brand.500" name="chevron-back" />
        </Button>
      </Center>
      <Flex justifyContent="center" height={8} width={8} mr={8}>
        {isAuth && (
          <>
            <Menu
              w="160"
              shouldOverlapWithTrigger={false} // @ts-ignore
              placement={"bottom right"}
              trigger={(triggerProps) => {
                return (
                  <Button
                    {...triggerProps}
                    w="12"
                    h="12"
                    shadow="3"
                    rounded="full"
                    variant="solid"
                    backgroundColor="white"
                  >
                    <Icon
                      size="6"
                      as={Ionicons}
                      color="brand.500"
                      name="person-circle-outline"
                    />
                  </Button>
                );
              }}
            >
              <Menu.Item
                onPress={() =>
                  user &&
                  navigation.navigate("Profile", {
                    profile: { id: user.id },
                    username: user.username,
                  })
                }
              >
                Perfil
              </Menu.Item>
              <Menu.Item onPress={() => navigation.navigate("Settings")}>
                Definições
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  setAuth(false, "logout");
                }}
              >
                Logout
              </Menu.Item>

              <Divider my="3" w="100%" />

              <Menu.Item onPress={() => navigation.navigate("Settings")}>
                Sobre nós
              </Menu.Item>
              <Menu.Item onPress={() => navigation.navigate("Settings")}>
                Aveiro 2027
              </Menu.Item>
              <Menu.Item onPress={() => navigation.navigate("Settings")}>
                Boardgames em Portugal
              </Menu.Item>
            </Menu>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default TransparentHeader;
