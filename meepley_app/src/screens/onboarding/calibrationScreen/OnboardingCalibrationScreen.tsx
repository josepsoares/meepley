import React, { useRef, useState } from "react";
import { BackHandler, ScrollView, useWindowDimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { useMutation } from "react-query";
import { useSnapshot } from "valtio";

import {
  Button,
  Heading,
  AlertDialog,
  Box,
  Text,
  HStack,
  Pressable,
  useToast,
} from "native-base";

import Btn from "../../../components/common/buttons/Btn";
import BoardgameSkillsScreen from "./components/BoardgameSkillsScreen";
import CalibrationFooter from "./components/CalibrationFooter";
import CategoriesScreen from "./components/CategoriesScreen";
import DisponibilityScreen from "./components/DisponibilityScreen";
import PlaceTypesScreen from "./components/PlaceTypesScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import LoadingModal from "../../../components/feedback/LoadingModal";

import MeePleyAPI from "../../../services/api/meepley";
import calibrationStore from "../../../services/store/calibrationStore";
import authStore from "../../../services/store/authStore";
import { _add } from "../../../utils/helpers/main/add";
import { ICalibrateUser } from "../../../ts/interfaces/api/ICalibrateUser";

const steps: JSX.Element[] = [
  <WelcomeScreen />,
  <BoardgameSkillsScreen />,
  <CategoriesScreen />,
  <PlaceTypesScreen />,
  <DisponibilityScreen />,
];

const OnboardingCalibrationScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const toast = useToast();
  const pageViewerRef = useRef<PagerView>(null);
  const cancelRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [didSkipCalibration, setDidSkipCalibration] = useState(false);

  //* States related to the user choices in the various steps of the calibration
  const {
    selectedBgSkill,
    selectedDays,
    selectedPlaceTypes,
    selectedCategories,
  } = useSnapshot(calibrationStore);

  //* current user logged in
  const { user } = useSnapshot(authStore);

  //* user mutation to update their calibration on the db
  const calibrateUserMutation = useMutation(
    (data: ICalibrateUser) =>
      MeePleyAPI.users.calibrateUser(user?.id as number, data),
    {
      onError: () => {
        toast.show({
          title: "Erro ao concluir calibração...",
          description:
            "Tenta novamente mais tarde quando entrares novamente na tua conta",
          status: "error",
          placement: "bottom",
          style: {
            borderRadius: 30,
            width: "92%",
            bottom: -38.5,
          },
        });
        navigation.navigate("Dashboard");
      },
      onSuccess: () => {
        toast.show({
          title: didSkipCalibration
            ? null
            : "Calibração concluída com sucesso!",
          description: didSkipCalibration
            ? "Poderás calibrar-te quando quiseres a partir do teu perfil de utilizador"
            : null,
          status: didSkipCalibration ? "info" : "success",
          placement: "bottom",
          style: {
            borderRadius: 30,
            width: "92%",
            bottom: -38.5,
          },
        });
        navigation.navigate("Dashboard");
      },
    }
  );

  //* Function to conclude the calibration of the user
  const completeCalibration = async () => {
    const didCompleteCalibration =
      selectedBgSkill !== null &&
      selectedCategories !== [] &&
      selectedDays !== [] &&
      selectedPlaceTypes !== [];

    if (didCompleteCalibration) {
      calibrateUserMutation.mutate({
        calibrated: true,
        boardgame_skill: selectedBgSkill,
        favorite_boardgame_categories: selectedCategories,
        favorite_days: selectedDays,
        favorite_place_types: selectedPlaceTypes,
      });
    } else {
      toast.show({
        title: "Não concluíste todos os passos da calibração...",
        status: "warning",
        placement: "bottom",
        style: {
          borderRadius: 30,
          width: "92%",
          bottom: -38.5,
        },
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <>
      <Box pb={20} backgroundColor="white" minH={height}>
        <PagerView style={{ flex: 1 }} ref={pageViewerRef}>
          {steps.map((component, key) => {
            return (
              <ScrollView key={key}>
                {component}
                <HStack py={6} space={3} justifyContent="center">
                  {steps.map((_, dotKey) => (
                    <Pressable
                      key={`dot ${dotKey}`}
                      height="4"
                      width="4"
                      borderRadius="full"
                      backgroundColor={
                        dotKey === key ? "brand.500" : "gray.300"
                      }
                      onPress={() => pageViewerRef.current?.setPage(dotKey)}
                    />
                  ))}
                </HStack>
                <CalibrationFooter
                  isLastPage={key === steps.length - 1 ? true : false}
                  changePage={() =>
                    pageViewerRef.current?.setPage(_add(key, 1))
                  }
                  setModal={() => setModalVisible(!modalVisible)}
                  concludeFunc={completeCalibration}
                />
              </ScrollView>
            );
          })}
        </PagerView>

        <AlertDialog
          isOpen={modalVisible}
          leastDestructiveRef={cancelRef}
          onClose={() => setModalVisible(false)}
          justifyContent="center"
          size="lg"
        >
          <AlertDialog.Content px="6" py="8">
            {/* Header of the Dialog */}
            <Heading fontSize="xl" pb="4">
              Cancelar calibração?
            </Heading>

            {/* Dialog Content */}
            <Text pb={6}>
              Sem concluires este processo o MeePley não conseguirá dar-te uma
              experiência e sugestões de partidas personalizadas para ti.
            </Text>

            {/* Dialog Footer */}
            <HStack justifyContent="flex-end" space={2}>
              <Button
                ref={cancelRef}
                variant="ghost"
                colorScheme="brand"
                borderRadius={"3xl"}
                px={5}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Voltar
              </Button>
              <Btn
                variant="solid"
                minWidth={"0.2"}
                px={5}
                onPress={() => {
                  setModalVisible(false);
                  setDidSkipCalibration(true);
                  calibrateUserMutation.mutate({ calibrated: false });
                }}
              >
                Cancelar
              </Btn>
            </HStack>
          </AlertDialog.Content>
        </AlertDialog>

        <LoadingModal
          condition={calibrateUserMutation.isLoading}
          message="Espera uns instantes enquanto concluímos a calibração..."
        />
      </Box>
    </>
  );
};

export default OnboardingCalibrationScreen;
