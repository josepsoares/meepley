import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AnimatePresence, MotiView } from "moti";
import { useMutation } from "react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Box,
  Text,
  Heading,
  Button,
  ScrollView,
  Flex,
  Image,
} from "native-base";

import Btn from "../../components/common/buttons/Btn";
import Emoji from "../../components/common/Emoji";
import PrivacyPolicyModal from "../../components/modals/PrivacyPolicyModal";
import RegisterUserForm from "./components/RegisterUserForm";
import RegisterEstablishmentForm from "./components/RegisterEstablishmentForm";

import MeePleyAPI from "../../services/api/meepley";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [modalPrivacyPolicyVisible, setModalPrivacyPolicyVisible] =
    useState(false);
  const [section, setSection] = useState("Conta de utilizador");

  const registerUser = useMutation(
    (data: {
      place: {} | null;
      email: string;
      username?: string;
      password: string;
      passwordConfirmation: string;
    }) => MeePleyAPI.users.register()
  );

  const onRegisterUserFormSubmit = async () => {
    registerUser.mutate({
      place: null,
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    });
  };

  const onRegisterEstablishmentFormSubmit = async () => {
    registerUser.mutate({
      place: {},
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Box position="absolute" top="4" left="320">
          <Image
            alt="First Meeple"
            resizeMode="contain"
            style={{ zIndex: 200, width: 45, height: 45 }}
            source={require("../../assets/icons/meeple.png")}
          />
        </Box>
        <Box position="absolute" top="200" left="5">
          <Image
            alt="Second Meeple"
            resizeMode="contain"
            style={[
              { zIndex: 200, width: 35, height: 35 },
              { transform: [{ rotate: "-20deg" }] },
            ]}
            source={require("../../assets/icons/meeple.png")}
          />
        </Box>
        <Box position="absolute" top="250" left="280">
          <Image
            alt="Third Meeple"
            resizeMode="contain"
            style={[
              { zIndex: 200, width: 50, height: 50 },
              { transform: [{ rotate: "-75deg" }] },
            ]}
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
            alt="MeePley Logo"
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
            <Heading pb="8">Registo</Heading>

            <Flex>
              {["Conta de utilizador", "Conta de estabelecimento"].map(
                (item, i) => (
                  <Btn
                    key={i}
                    w="100%"
                    height={10}
                    padding={0}
                    colorScheme="brand"
                    mb={i === 0 ? 4 : 0}
                    variant={section === item ? "solid" : "outline"}
                    onPress={() => setSection(item)}
                  >
                    {item}
                  </Btn>
                )
              )}
            </Flex>

            <AnimatePresence exitBeforeEnter initial={true}>
              <MotiView
                key={section}
                from={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {section === "Conta de utilizador" ? (
                  <RegisterUserForm />
                ) : (
                  <RegisterEstablishmentForm />
                )}
              </MotiView>
            </AnimatePresence>

            <Text textAlign="center" pb={2}>
              Já tens conta?{" "}
              <Text
                underline
                color="brand.600"
                onPress={() => navigation.navigate("Login")}
              >
                Entra aqui
              </Text>
            </Text>
            <Text textAlign="center">
              Ao fazeres o registo és obrigado a concordar com os nossos Termos
              e aceitar as{" "}
              <Text
                underline
                color="brand.600"
                onPress={() =>
                  setModalPrivacyPolicyVisible(!modalPrivacyPolicyVisible)
                }
              >
                Políticas de Privacidade
              </Text>
            </Text>
          </Box>

          <Flex px={2} pb={2} direction="row" justifyContent="space-between">
            <Button
              p={3}
              bgColor="gray.200"
              borderRadius="lg"
              onPress={() =>
                navigation.navigate("BoardgamesList", {
                  previousRoute: "Login",
                })
              }
            >
              <Text accessibilityLabel="Boardgames 🎲">
                <Emoji size={20} emo="🎲" />
                {"  "}Boardgames
              </Text>
            </Button>

            <Button
              p={3}
              bgColor="gray.200"
              borderRadius="lg"
              onPress={() => navigation.navigate("Utilities")}
            >
              <Text accessibilityLabel="Utilitários ⏲️">
                <Emoji size={20} emo="⏲" />
                {"  "}Utilitários
              </Text>
            </Button>
          </Flex>
        </Box>

        {/* privacy policy modal */}
        <PrivacyPolicyModal
          modalVisible={modalPrivacyPolicyVisible}
          setModal={setModalPrivacyPolicyVisible}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
