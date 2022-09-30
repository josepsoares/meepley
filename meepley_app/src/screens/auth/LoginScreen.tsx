import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Box,
  Text,
  Divider,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  VStack,
  Flex,
  ScrollView,
  Image,
  Button,
  useToast,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import Emoji from "../../components/common/Emoji";
import Loading from "../../components/feedback/Loading";
import EmailInput from "../../components/common/forms/EmailInput";
import PasswordInput from "../../components/common/forms/PasswordInput";
import PrivacyPolicyModal from "../../components/modals/PrivacyPolicyModal";

import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import logInSchema from "../../utils/helpers/validation/logInSchema";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPrivacyPolicyVisible, setModalPrivacyPolicyVisible] =
    useState(false);

  const toast = useToast();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const loginFormik = useFormik({
    validationSchema: logInSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);

      try {
        const { data } = await MeePleyAPI.users.login(
          values.email,
          values.password
        );

        authStore.isAuth = true;
        authStore.user = data.user;
        authStore.token = data.jwt;

        actions.setSubmitting(false);

        if (data.user.calibrated === null) {
          navigation.navigate("CalibrationOnboarding");
        } else if (data.user.places_id) {
          navigation.navigate("DashboardPlace");
        } else {
          navigation.navigate("Dashboard");
        }
      } catch (err) {
        actions.setSubmitting(false);
        let toastMessage =
          "Ocorreu um erro inesperado! Tenta novamente mais tarde";

        if (err?.status === 404) {
          toastMessage =
            "O email inserido não se encontra registado no MeePley";
        } else if (err?.status === 401) {
          toastMessage = "A password inserida está incorreta";
        }

        toast.show({
          id: "error-create-matchroom",
          title: "Erro no login",
          status: "warning",
          description: toastMessage,
          placement: "bottom",
          style: {
            width: "95%",
            bottom: -38.5,
          },
        });
      }
    },
  });

  const {
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    errors,
    values,
  } = loginFormik;

  return (
    <SafeAreaView>
      <ScrollView>
        <Box position="absolute" top="2%" left="80%">
          <Image
            alt="Primeiro meeple"
            resizeMode="contain"
            style={[
              { zIndex: 200, width: 35, height: 35 },
              { transform: [{ rotate: "-70deg" }] },
            ]}
            source={require("../../assets/icons/meeple.png")}
          />
        </Box>
        <Box position="absolute" top="10%" left="-5%">
          <Image
            alt="Segundo meeple"
            resizeMode="contain"
            style={{ zIndex: 200, width: 60, height: 60 }}
            source={require("../../assets/icons/meeple.png")}
          />
        </Box>
        <Box position="absolute" top="24%" left="75%">
          <Image
            alt="Terceiro Meeple"
            resizeMode="contain"
            style={[{ zIndex: 200, width: 80, height: 80 }]}
            source={require("../../assets/icons/meeple.png")}
          />
        </Box>
        <Flex
          pb="48"
          h="475"
          w="full"
          alignItems="center"
          justifyContent="center"
          bg={{
            linearGradient: {
              colors: ["#614eca", "rgba(157, 146, 218, 0.5312)"],
              start: [-1.2, 0],
              end: [0, 2],
              location: [0.25, 0.4, 1],
            },
          }}
        >
          <Image
            alt="Logo MeePley"
            resizeMode="contain"
            style={{ width: 250 }}
            source={require("../../assets/images/branding/meepley/logo-w-slogan-white.png")}
          />
        </Flex>

        <Box
          w="full"
          bgColor="#FAFAFA"
          marginTop="-200"
          borderTopRightRadius={135}
        >
          <Box p={12}>
            <Heading pb={6}>Log in</Heading>

            <VStack space={6} width="100%">
              <EmailInput
                isRequired={false}
                value={values.email}
                error={errors.email}
                touched={touched.email}
                {...{ setFieldValue, handleBlur }}
              />

              <PasswordInput
                isRequired={false}
                name="password"
                label="Password"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                {...{ handleChange, handleBlur }}
              />

              <Flex direction="row" justifyContent="center" pb={6}>
                <Btn
                  width={40}
                  minWidth={40}
                  variant="solid"
                  isLoading={loginFormik.isSubmitting}
                  isDisabled={loginFormik.isSubmitting}
                  onPress={loginFormik.handleSubmit as (values: any) => void}
                >
                  Entrar
                </Btn>
              </Flex>
            </VStack>

            <Text textAlign="center" pb="2">
              Não tens conta de utilizador ou estabelecimento?{" "}
              <Text
                underline
                color="brand.600"
                onPress={() => navigation.navigate("Register")}
              >
                Regista-te aqui
              </Text>
            </Text>
            <Text textAlign="center">
              Esqueceste-te da tua password?{" "}
              <Text
                underline
                color="brand.600"
                onPress={() => setModalVisible(!modalVisible)}
              >
                Carrega aqui
              </Text>
            </Text>

            <Divider my="8" />

            <Text
              pb="4"
              textAlign="center"
              textTransform="uppercase"
              fontWeight="bold"
            >
              Entrar com
            </Text>
            <HStack justifyContent="center" space={2}>
              <IconButton
                size="lg"
                bgColor={true ? "gray.400" : "blue.400"}
                borderRadius="full"
                accessibilityRole="button"
                accessibilityLabel="Botão de registo Facebook"
                isDisabled={true}
                _icon={{
                  as: FontAwesome5,
                  name: "facebook",
                  color: "white",
                  size: 7,
                }}
              />
              <IconButton
                size="lg"
                bgColor={true ? "gray.400" : "red.400"}
                borderRadius="full"
                accessibilityRole="button"
                accessibilityLabel="Botão de registo Google"
                isDisabled={true}
                _icon={{
                  as: FontAwesome5,
                  name: "google",
                  color: "white",
                  size: 7,
                }}
              />
            </HStack>

            <Text pt="8" textAlign="center">
              Ao fazeres login ou registares uma conta concordas com os nossos
              termos e a nossa{" "}
              <Text
                underline
                color="brand.600"
                onPress={() =>
                  setModalPrivacyPolicyVisible(!modalPrivacyPolicyVisible)
                }
              >
                Política de Privacidade
              </Text>
            </Text>
          </Box>

          <Flex px="2" pb="2" direction="row" justifyContent="space-between">
            <Button
              p="3"
              bgColor="gray.200"
              borderRadius="lg"
              accessibilityLabel="Boardgames 🎲"
              onPress={() =>
                navigation.navigate("BoardgamesList", {
                  previousRoute: "Login",
                })
              }
            >
              <Text>
                <Emoji size={20} emo="🎲" />
                {"  "}Boardgames
              </Text>
            </Button>

            <Button
              p="3"
              bgColor="gray.200"
              borderRadius="lg"
              accessibilityLabel="Utilitários ⏲️"
              onPress={() => navigation.navigate("Utilities")}
            >
              <Text>
                <Emoji size={20} emo="⏲" />
                {"  "}Utilitários
              </Text>
            </Button>
          </Flex>

          {/* loading modal */}
          <Modal
            isOpen={loginFormik.isSubmitting}
            closeOnOverlayClick={false}
            isKeyboardDismissable={false}
            size="lg"
          >
            <Modal.Content bgColor="white">
              <Modal.Body py="10" bgColor="white">
                <Loading />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* forgot password modal */}
          <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            avoidKeyboard
            justifyContent="flex-end"
            bottom="4"
            size="lg"
          >
            <Modal.Content p="6" shadow="0">
              <Modal.CloseButton />
              <Heading fontSize="lg" py="4" px="3" borderBottomWidth="0">
                Recuperar Password
              </Heading>
              <Modal.Body>
                Escreve o teu email no input abaixo para nós te pudermos enviar
                instruções para recuperares a tua password
                <Box pt="4" pb="3">
                  <Input
                    variant="underlined"
                    fontSize="sm"
                    placeholder="insere o teu email"
                  />
                </Box>
              </Modal.Body>
              <Modal.Footer bg="white">
                <Btn
                  flex="1"
                  minWidth="40"
                  width="40"
                  variant="solid"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  Continuar
                </Btn>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          {/* privacy policy modal */}
          <PrivacyPolicyModal
            modalVisible={modalPrivacyPolicyVisible}
            setModal={setModalPrivacyPolicyVisible}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
