import React, { useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useMutation, useQuery } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { useSnapshot } from "valtio";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  ScrollView,
  Text,
} from "native-base";

import Btn from "../../components/common/buttons/Btn";
import MatchroomCarousel from "../../components/common/MatchroomCarousel";
import PrintToast from "../../components/feedback/PrintToast";
import Emoji from "../../components/common/Emoji";
import Loading from "../../components/feedback/Loading";
import LoadingModal from "../../components/feedback/LoadingModal";
import ErrorSection from "../../components/feedback/ErrorSection";

import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import { refreshControlColors } from "../../utils/constants/colors";

const MatchroomsDashboardScreen = () => {
  const { user } = useSnapshot(authStore);
  const [refreshing, setRefreshing] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const initialRef = useRef(null);
  const navigation = useNavigation();

  // TODO - check for a better way to do this verification (check user object is empty)
  const {
    isLoading: loadingUserMatchrooms,
    error: userMatchroomsError,
    data: userMatchroomsData,
    refetch: refetchUserMatchrooms,
  } = useQuery(
    ["user-matchrooms", user ? user?.id : 0],
    () => MeePleyAPI.matchrooms.getUserMatchrooms(user ? user?.id : 0),
    {
      enabled: true,
      retry: 3,
    }
  );

  const {
    isLoading: loadingRecommendedMatchrooms,
    error: recommendedMatchroomsError,
    data: recommendedMatchroomsData,
    refetch: refetchRecommendedMatchrooms,
  } = useQuery("recommended-matchrooms", MeePleyAPI.matchrooms.getMatchrooms, {
    enabled: user?.calibrated ? true : false,
    retry: 3,
  });

  const {
    isLoading: loadingDivergentMatchrooms,
    error: divergentMatchroomsError,
    data: divergentMatchroomsData,
    refetch: refetchDivergentMatchrooms,
  } = useQuery("divergent-matchrooms", MeePleyAPI.matchrooms.getMatchrooms, {
    enabled: user?.calibrated ? true : false,
    retry: 3,
  });

  const enterMatchroomViaInviteCode = useMutation(
    (data: { code: string; userId: number }) =>
      MeePleyAPI.matchrooms.enterMatchroomViaCode(data.code, data.userId),
    {
      onSuccess: ({ data }) => {
        PrintToast({
          status: "error",
          title: "Erro a inserir código de convite",
        });
        navigation.navigate("Matchroom", { matchroom: data });
      },
      onError: (err) => {
        PrintToast({
          status: "error",
          title: "Erro a inserir código de convite",
        });
      },
    }
  );

  const inviteCodeFormik = useFormik({
    validationSchema: Yup.object().shape({
      code: Yup.string()
        .required("Necessitas de inserir o código")
        .min(7, "O código tem de possuir 7 caracteres"),
    }),
    initialValues: {
      code: "",
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);

      try {
        actions.setSubmitting(false);
        setModalIsVisible(false);

        // enterMatchroomViaInviteCode.mutate();
      } catch (err) {
        actions.setSubmitting(false);

        PrintToast({
          status: "error",
          title: "Erro a inserir código de convite",
        });
      }
    },
  });

  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView
        refreshControl={
          <RefreshControl
            {...refreshControlColors}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);

              if (user?.calibrated) {
                refetchUserMatchrooms();
                refetchRecommendedMatchrooms();
                refetchDivergentMatchrooms();
              } else {
                refetchUserMatchrooms();
              }
            }}
          />
        }
      >
        <Box pt="4" pb="12">
          <Btn variant="ghost" onPress={() => setModalIsVisible(true)}>
            Tens um código de convite para uma partida? Carrega aqui para
            inserí-lo e entrares na partida
          </Btn>

          <Box pt="4">
            <Heading px="8" pb="4">
              As tuas partidas/eventos
            </Heading>
            <Text px="8" accessibilityRole="text">
              As partidas e/ou eventos que fazes parte! Não te esqueças das
              datas e diverte-te à grande <Emoji size={15} emo="🙌" />{" "}
            </Text>
            {loadingUserMatchrooms ? (
              <Box px="8">
                <Loading />
              </Box>
            ) : userMatchroomsError ? (
              <Box px="8">
                <ErrorSection
                  err={userMatchroomsError}
                  custom404Message={
                    <>
                      Ainda não criaste ou te juntaste a nenhuma partida/evento{" "}
                      <Emoji size={15} emo="😟" />
                    </>
                  }
                />
              </Box>
            ) : userMatchroomsData ? (
              <MatchroomCarousel matchRooms={userMatchroomsData.data} />
            ) : null}
          </Box>

          <Divider w="65%" mx="auto" my="6" />

          <>
            <Box>
              <Heading pb="4" px="8">
                Partidas recomendadas
              </Heading>
              <Text px="8" accessibilityRole="text">
                Partidas selecionadas especialmente para ti! Com certeza irão te
                interessar... <Emoji size={15} emo="💘" />{" "}
              </Text>
              {user?.calibrated ? (
                <>
                  {loadingRecommendedMatchrooms ? (
                    <Box px="8">
                      <Loading />
                    </Box>
                  ) : recommendedMatchroomsError ? (
                    <Box px="8">
                      <ErrorSection
                        err={recommendedMatchroomsError}
                        custom404Message={
                          <>
                            Não encontramos nenhuma partida recomendada{" "}
                            <Emoji emo="😥" />
                          </>
                        }
                      />
                    </Box>
                  ) : recommendedMatchroomsData ? (
                    <MatchroomCarousel
                      matchRooms={recommendedMatchroomsData.data}
                    />
                  ) : null}
                </>
              ) : (
                <Box px="8" pt="3">
                  <Text textAlign="center" color="brand.700">
                    Precisas de concluir a tua calibração para te se serem
                    sugeridas estas partidas <Emoji size={15} emo="😟" />
                  </Text>
                </Box>
              )}
            </Box>

            <Divider w="65%" mx="auto" my="6" />

            <Box>
              <Heading px="8" pb="4">
                Partidas fora da caixa
              </Heading>
              <Text px="8" accessibilityRole="text">
                Explora partidas fora da tua zona de conforto, quem sabe não
                descobres algo porreiro! <Emoji emo="📦" />
              </Text>
              {user?.calibrated ? (
                <>
                  {loadingDivergentMatchrooms ? (
                    <Box px="8">
                      <Loading />
                    </Box>
                  ) : divergentMatchroomsError ? (
                    <Box px="8">
                      <ErrorSection
                        err={divergentMatchroomsError}
                        custom404Message={
                          <>
                            Não encontramos nenhuma partida fora da caixa{" "}
                            <Emoji emo="😥" />
                          </>
                        }
                      />
                    </Box>
                  ) : divergentMatchroomsData ? (
                    <MatchroomCarousel
                      matchRooms={divergentMatchroomsData.data}
                    />
                  ) : null}
                </>
              ) : (
                <Box px="8" pt="3">
                  <Text textAlign="center" color="brand.700">
                    Precisas de concluir a tua calibração para te se serem
                    sugeridas estas partidas <Emoji size={15} emo="😟" />
                  </Text>
                </Box>
              )}
            </Box>
          </>

          <Divider w="65%" mx="auto" my="6" />

          <Btn
            py="2"
            variant="ghost"
            onPress={() => navigation.navigate("MatchroomsList")}
          >
            Ver todas as partidas
          </Btn>
        </Box>

        <LoadingModal condition={enterMatchroomViaInviteCode.isLoading} />

        <Modal
          size="xl"
          isOpen={modalIsVisible}
          onClose={() => setModalIsVisible(false)}
          initialFocusRef={initialRef}
        >
          <Modal.Content>
            <Modal.CloseButton />

            <Modal.Body pt="12" pb="6" px="6">
              <FormControl
                isInvalid={
                  inviteCodeFormik?.touched && inviteCodeFormik?.errors?.code
                    ? true
                    : false
                }
                w="100%"
              >
                <FormControl.Label fontWeight="bold">
                  <Heading fontSize="xl" pb="3">
                    Código
                  </Heading>
                </FormControl.Label>

                <Input
                  px="4"
                  size="md"
                  type="text"
                  maxLength={70}
                  variant="rounded"
                  backgroundColor="white"
                  value={inviteCodeFormik.values.code}
                  isDisabled={inviteCodeFormik.isSubmitting}
                  onBlur={() => inviteCodeFormik.handleBlur("code")}
                  onChangeText={(val) =>
                    inviteCodeFormik.setFieldValue("code", val)
                  }
                />

                {inviteCodeFormik.errors?.code &&
                  inviteCodeFormik.touched?.code && (
                    <FormControl.ErrorMessage>
                      {inviteCodeFormik.errors.code}
                    </FormControl.ErrorMessage>
                  )}
              </FormControl>

              <HStack pt="6" justifyContent="flex-end">
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={() => setModalIsVisible(false)}
                  >
                    Cancelar
                  </Button>
                  <Btn
                    variant="solid"
                    isDisabled={inviteCodeFormik.isSubmitting}
                    isLoading={inviteCodeFormik.isSubmitting}
                    onPress={
                      inviteCodeFormik.handleSubmit as (values: any) => void
                    }
                  >
                    Inserir
                  </Btn>
                </Button.Group>
              </HStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </>
  );
};

export default MatchroomsDashboardScreen;
