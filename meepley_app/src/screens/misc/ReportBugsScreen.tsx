import React from "react";
import { StatusBar } from "expo-status-bar";
import { useWindowDimensions } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  FormControl,
  Heading,
  Icon,
  ScrollView,
  Text,
  TextArea,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";

import Emoji from "../../components/common/Emoji";
import Btn from "../../components/common/buttons/Btn";

const ReportBugsScreen = () => {
  const { height } = useWindowDimensions();

  const bugFeedbackFormik = useFormik({
    validationSchema: Yup.object().shape({
      description: Yup.string()
        .required("Necessitas de descrever o(s) bug(s)")
        .min(100, "A descrição do bug tem de ter no minímo 100 caracteres")
        .max(300, "A descrição do bug não pode ultrapassar os 300 caracteres"),
    }),
    initialValues: {
      description: "",
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);

      try {
        actions.setSubmitting(false);
      } catch (err) {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <StatusBar backgroundColor="white" />
      <ScrollView>
        <Box py="10" px="8" minH={height - 50} backgroundColor="white">
          <Text pb="2">
            O MeePley ainda é uma aplicação em fase alpha, visto que se
            encontrares algum tipo de bug gostariamos que o descrevesses na
            caixa de texto abaixo.
          </Text>

          <Text pb="2">
            Podes sempre reportar o bug via as nossas redes sociais (disponivéis
            na página de Sobre nós) caso não o queiras fazer por aqui
          </Text>

          <Text pb="8">
            Independentemente da forma, tudo é isto é para tu nós ajudares a
            conseguir corrigir o maior número de bugs e tornar o MeePley melhor
            para todos os utilizadores. <Emoji emo="😊" />
          </Text>

          <FormControl
            isInvalid={
              bugFeedbackFormik?.touched &&
              bugFeedbackFormik?.errors?.description
                ? true
                : false
            }
            w="100%"
          >
            <FormControl.Label fontWeight="bold">
              <Heading fontSize="xl" pb="3">
                Descrição do bug
              </Heading>
            </FormControl.Label>
            <TextArea
              px="4"
              size="md"
              type="text"
              variant="rounded"
              maxLength={300}
              numberOfLines={4}
              backgroundColor="white"
              value={bugFeedbackFormik.values.description}
              isDisabled={bugFeedbackFormik.isSubmitting}
              onBlur={() => bugFeedbackFormik.handleBlur("description")}
              onChangeText={(val) =>
                bugFeedbackFormik.setFieldValue("description", val)
              }
            />

            {bugFeedbackFormik.errors?.description && (
              <FormControl.ErrorMessage>
                {bugFeedbackFormik.errors.description}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <Btn
            mt="10"
            mx="auto"
            variant="solid"
            leftIcon={
              <Icon
                as={Ionicons}
                name="bug-outline"
                color="white"
                size="5"
                mx="2"
              />
            }
            isDisabled={bugFeedbackFormik.isSubmitting}
            isLoading={bugFeedbackFormik.isSubmitting}
            onPress={bugFeedbackFormik.handleSubmit as (values: any) => void}
          >
            Submeter feedback
          </Btn>

          <Text pt="8">
            Obrigado pelo teu feedback do(s) bug(s) que encontraste! A sério,
            ajuda-nos imenso! <Emoji emo="👏" />
          </Text>
        </Box>
      </ScrollView>
    </>
  );
};

export default ReportBugsScreen;
