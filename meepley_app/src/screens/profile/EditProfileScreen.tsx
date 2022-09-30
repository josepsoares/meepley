import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "react-query";
import { useSnapshot } from "valtio";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";

import {
  Avatar,
  Box,
  Center,
  FormControl,
  Heading,
  Icon,
  IconButton,
  Input,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import PrintToast from "../../components/feedback/PrintToast";
import Emoji from "../../components/common/Emoji";

import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import editProfileSchema from "../../utils/helpers/validation/editorProfileSchema";

const EditProfileScreen = () => {
  const { updateUserProp, user } = useSnapshot(authStore);
  const [chosenImage, setChosenImage] = useState<ImagePicker.ImageInfo | null>(
    null
  );

  const editProfileFormik = useFormik({
    validationSchema: editProfileSchema,
    initialValues: {
      name: "",
      username: "",
      title: "",
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);

      try {
        if (chosenImage !== null) {
          updateUserAvatar.mutate({ file: chosenImage });
        }

        if (
          values.name !== "" ||
          values.title !== "" ||
          values.username !== ""
        ) {
          updateUserGeneralInfo.mutate({
            name: values.name,
            username: `@${values.username}`,
          });
        }

        actions.setSubmitting(false);
      } catch (err) {
        actions.setSubmitting(false);

        PrintToast({
          title: "Error ao atualizar perfil",
          status: "warning",
        });
      }
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 1,
    });

    if (!result.cancelled) {
      setChosenImage(result);
    }
  };

  const updateUserAvatar = useMutation(
    (data: { file: ImagePicker.ImageInfo }) => {
      const splitUriFile = data.file.uri.split("/");
      const nameFile = splitUriFile[splitUriFile.length - 1];

      return MeePleyAPI.users.uploadAndUpdateUserAvatar(
        user?.id as number,
        data.file,
        nameFile
      );
    },
    {
      onError(error) {
        PrintToast({
          title: "Erro ao atualizar avatar",
          status: "warning",
        });
      },
      onSuccess(data) {
        updateUserProp("avatar", data.avatar);

        PrintToast({
          title: "Avatar atualizado com sucesso",
          status: "success",
        });
      },
    }
  );

  const updateUserGeneralInfo = useMutation(
    (data: { name: string; username: string }) =>
      MeePleyAPI.users.updateUser(user?.id as number, {
        name: data.name,
        username: data.username,
      }),
    {
      onError(err: Error | AxiosError) {
        if (axios.isAxiosError(err)) {
          PrintToast({
            title:
              err?.response?.data.message === "Username already in use"
                ? "O username que escolheste já está em uso"
                : "Erro ao atualizar informações do perfil",
            description:
              err?.response?.data.message === "Username already in use"
                ? "Opta por um username diferente"
                : undefined,
            status: "warning",
          });
        } else {
          PrintToast({
            title: "O username que escolheste já está em uso",
            status: "warning",
          });
        }
      },
      onSuccess({ data }) {
        updateUserProp("username", data.username);
        updateUserProp("name", data.name);

        PrintToast({
          title: "Informações do perfil atualizadas com sucesso",
          status: "success",
        });
      },
    }
  );

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />

      <ScrollView>
        <Box px="8" py="10" backgroundColor="#FAFAFA">
          <Box pb="8">
            <Heading pb="8">Informação Geral</Heading>

            <VStack space={6} width="100%">
              <Box>
                <Heading pb="6" fontSize="lg">
                  Avatar
                </Heading>

                <Center size={40}>
                  <IconButton
                    w="50%"
                    h="50%"
                    zIndex="2"
                    opacity="0.8"
                    position="absolute"
                    alignSelf="center"
                    justifySelf="center"
                    bgColor="gray.100"
                    borderRadius="full"
                    variant="ghost"
                    _icon={{
                      size: 10,
                      as: Feather,
                      name: "upload",
                      color: "brand.500",
                      mx: "auto",
                      my: "auto",
                    }}
                    onPress={() => pickImage()}
                  />
                  <Avatar
                    w="100%"
                    h="100%"
                    shadow={4}
                    source={{
                      uri: !chosenImage ? user?.avatar : chosenImage.uri,
                    }}
                  />
                </Center>
              </Box>

              <FormControl
                w="100%"
                isInvalid={
                  editProfileFormik?.touched && editProfileFormik?.errors?.name
                    ? true
                    : false
                }
              >
                <FormControl.Label>
                  <Heading fontSize="lg">Nome</Heading>
                </FormControl.Label>
                <Input
                  px="4"
                  size="md"
                  type="text"
                  maxLength={70}
                  variant="rounded"
                  backgroundColor="white"
                  value={editProfileFormik.values.name}
                  isDisabled={editProfileFormik.isSubmitting}
                  onBlur={() => editProfileFormik.handleBlur("name")}
                  onChangeText={(val) =>
                    editProfileFormik.setFieldValue("name", val)
                  }
                />

                {editProfileFormik.errors?.name &&
                  editProfileFormik.touched?.name && (
                    <FormControl.ErrorMessage>
                      {editProfileFormik.errors.name}
                    </FormControl.ErrorMessage>
                  )}
              </FormControl>

              <FormControl
                w="100%"
                isInvalid={
                  editProfileFormik?.touched &&
                  editProfileFormik?.errors?.username
                    ? true
                    : false
                }
              >
                <FormControl.Label>
                  <Heading fontSize="lg">Username</Heading>
                </FormControl.Label>

                <Input
                  px="4"
                  size="md"
                  type="text"
                  maxLength={70}
                  variant="rounded"
                  backgroundColor="white"
                  value={editProfileFormik.values.username}
                  isDisabled={editProfileFormik.isSubmitting}
                  onBlur={() => editProfileFormik.handleBlur("username")}
                  onChangeText={(val) =>
                    editProfileFormik.setFieldValue("username", val)
                  }
                />

                {editProfileFormik.errors?.username &&
                  editProfileFormik.touched?.username && (
                    <FormControl.ErrorMessage>
                      {editProfileFormik.errors.username}
                    </FormControl.ErrorMessage>
                  )}
              </FormControl>

              <FormControl
                w="100%"
                isInvalid={
                  editProfileFormik?.touched && editProfileFormik?.errors?.name
                    ? true
                    : false
                }
              >
                <FormControl.Label>
                  <Heading fontSize="lg">Título</Heading>
                </FormControl.Label>

                {true ? (
                  <Text>
                    Esta feature ainda está em desenvolvimento! Segue as nossas
                    redes para saberes quando estiver pronta{" "}
                    <Emoji size={15} emo="😉" />
                  </Text>
                ) : (
                  <SelectInput
                    mt={1}
                    isDisabled={editProfileFormik.isSubmitting}
                    selectedValue={editProfileFormik.values.title}
                    accessibilityLabel="O número minímo de jogadores"
                    onValueChange={(itemValue) =>
                      editProfileFormik.setFieldValue(
                        "estimated_duration",
                        itemValue
                      )
                    }
                  >
                    {["10 minutos", "20 minutos", "30 minutos"].map((item) => (
                      <Select.Item
                        key={item}
                        label={`${item}`}
                        value={`${item}`}
                      />
                    ))}
                  </SelectInput>
                )}
              </FormControl>
            </VStack>

            <Btn
              mt="10"
              mx="auto"
              variant="solid"
              leftIcon={
                <Icon
                  as={Ionicons}
                  name="save-outline"
                  color="white"
                  size="5"
                  mx="2"
                />
              }
              isDisabled={editProfileFormik.isSubmitting}
              isLoading={editProfileFormik.isSubmitting}
              onPress={editProfileFormik.handleSubmit as (values: any) => void}
            >
              Guardar alterações
            </Btn>

            <Btn
              mt="4"
              mx="auto"
              variant="ghost"
              isDisabled={editProfileFormik.isSubmitting}
              onPress={() => {
                editProfileFormik.setFieldValue("name", "");
                editProfileFormik.setFieldValue("username", "");
                editProfileFormik.setFieldValue("title", "");

                setChosenImage(null);
              }}
            >
              Descartar alterações
            </Btn>
          </Box>
        </Box>
      </ScrollView>
    </>
  );
};

export default EditProfileScreen;
