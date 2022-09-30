import React from "react";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSnapshot } from "valtio";

import { Box, Divider, ScrollView, Text, VStack } from "native-base";

import { configsStore } from "../../services/store/configsStore";

// TODO - finish the features of this screen
const SettingsScreen = () => {
  const { setFontSize, setContrast, setNotifications } =
    useSnapshot(configsStore);

  const settingsList = [
    {
      title: "Dados Pessoais",
      subTitle: "Altera os teus dados",
      onPressFunc: () => {},
    },
    {
      title: "Notificações",
      subTitle: "Desativa ou ativa as notificações da aplicação",
      onPressFunc: () => {},
    },
    {
      title: "Tamanho da Fonte",
      subTitle: "Altera o tamanho da fonte da aplicação",
      onPressFunc: () => {
        setFontSize(16);
      },
    },
    {
      title: "Contraste",
      subTitle: "Altera o nível de contraste da aplicação",
      onPressFunc: () => {},
    },
    {
      title: "Ajuda",
      subTitle: "Material de auxílio para perceber como usar o MeePley",
      onPressFunc: () => {},
    },
    {
      title: "Apagar Conta",
      subTitle: "Elimina a tua conta permanentemente",
      onPressFunc: () => {},
    },
  ];

  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView>
        <Box bgColor="white" p="8">
          <VStack space="4" divider={<Divider w="100%" />}>
            {settingsList.map(({ title, subTitle, onPressFunc }) => (
              <TouchableOpacity key={title} onPress={onPressFunc}>
                <Box>
                  <Text fontSize="md" color="brand.600" bold>
                    {title}
                  </Text>
                  {subTitle && <Text fontSize="sm">{subTitle}</Text>}
                </Box>
              </TouchableOpacity>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </>
  );
};

export default SettingsScreen;
