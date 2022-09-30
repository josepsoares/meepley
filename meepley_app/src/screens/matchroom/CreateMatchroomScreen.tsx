import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFormik } from "formik";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSnapshot } from "valtio";
import { StatusBar } from "expo-status-bar";
import * as Yup from "yup";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt";

import {
  Box,
  Flex,
  Heading,
  ScrollView,
  VStack,
  FormControl,
  Input,
  Select,
  Radio,
  Stack,
  HStack,
  Pressable,
  Icon,
  useToast,
  Divider,
  Text,
  TextArea,
} from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";

import Btn from "../../components/common/buttons/Btn";
import SelectInput from "../../components/common/forms/SelectInput";
import LoadingModal from "../../components/feedback/LoadingModal";
import ChooseCard from "./components/ChooseCard";

import { StackParamList } from "../../navigation";
import MeePleyAPI from "../../services/api/meepley";
import authStore from "../../services/store/authStore";
import { createMatchroomStore } from "../../services/store/createMatchroomStore";
import { IBoardgameMeepley } from "../../ts/interfaces/boardgames/IBoardgame";

dayjs.extend(customParseFormat);
dayjs.locale("pt");

const CreateMatchroomFormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Tens de escrever um nome para a partida")
    .min(4, "O nome da partida tem de ter mais de 4 caracteres")
    .max(70, "O nome da partida não pode ultrapassar 70 caracteres"),
  description: Yup.string(),
  min_players: Yup.number().required(
    "Precisas de especificar o nrº de jogadores"
  ),
  max_players: Yup.number().required(
    "Precisas de especificar o nrº de jogadores"
  ),
  estimated_duration: Yup.string().required(
    "Precisas de colocar a duração da partida"
  ),
  scheduled_date: Yup.string().required(
    "Precisas especificar corretamente uma data"
  ),
  scheduled_hour: Yup.string().required(
    "Precisas especificar corretamente uma data"
  ),
});

const CreateMatchroomScreen: React.FC<
  NativeStackScreenProps<StackParamList, "CreateMatch">
> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const toast = useToast();

  const { boardgames, place } = useSnapshot(createMatchroomStore);
  const { user } = useSnapshot(authStore);

  const [isHourPickerVisible, setHourPickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isoScheduledDate, setIsoScheduledDate] = useState("");

  const createMachroomFormik = useFormik({
    validationSchema: CreateMatchroomFormSchema,
    initialValues: {
      name: "",
      description: "",
      min_players: "",
      max_players: "",
      estimated_duration: "",
      scheduled_date: "",
      scheduled_hour: "",
      private: "publica",
    },
    onSubmit: async (values, actions) => {
      try {
        // TODO - turn this into a useMutation
        await MeePleyAPI.matchrooms.createMatchroom({
          name: values.name,
          description: values.description,
          image: boardgames[0].thumbnail,
          private: values.private === "privada",
          estimated_duration: values.estimated_duration,
          min_players: parseInt(values.min_players),
          max_players: parseInt(values.max_players),
          scheduled_date: values.scheduled_date,
          scheduled_hour: values.scheduled_hour.replace(/\s/g, ""),
          boardgames: boardgames as IBoardgameMeepley[],
          user: user?.id,
          place: place?.id,
        });

        actions.setSubmitting(false);

        toast.show({
          id: "success-create-matchroom",
          title: "Partida criada com sucesso!",
          status: "success",
          description: "Agora é só esperar pelo pessoal para diversão começar!",
          placement: "bottom",
          style: {
            width: "95%",
            bottom: -38.5,
          },
        });

        navigation.goBack();
      } catch (err) {
        actions.setSubmitting(false);

        toast.show({
          id: "error-create-matchroom",
          title: "Error ao criar partida",
          status: "warning",
          description: "Ocorreu um erro inesperado! Tenta novamente mais tarde",
          placement: "bottom",
          style: {
            width: "95%",
            bottom: -38.5,
          },
        });
      }
    },
  });

  //console.log(createMachroomFormik.errors);

  return (
    <>
      <StatusBar backgroundColor="#FAFAFA" />
      <ScrollView>
        <Box p={10} minHeight={height} backgroundColor="#FAFAFA">
          <Stack space={4} pt={1} pb={6}>
            <ChooseCard
              onPressCard={() =>
                navigation.navigate("PlacesList", {
                  previousRoute: "createMatchroom",
                })
              }
              asset="map-marker"
              title="Local"
              text={place ? place?.name : "Escolhe o local"}
              iconBgColor={place ? "lGreen.500" : "brand.500"}
            />

            <ChooseCard
              onPressCard={() =>
                navigation.navigate("BoardgamesList", {
                  previousRoute: "createMatchroom",
                })
              }
              asset="dice-d20"
              title="Boardgame(s)"
              text={
                boardgames.length !== 0
                  ? boardgames[0]?.name
                  : "Escolhe um boardgame"
              }
              iconBgColor={boardgames.length !== 0 ? "lGreen.500" : "brand.500"}
            />
          </Stack>
          <Box>
            <Heading pt={4} pb={6}>
              Detalhes
            </Heading>

            <VStack space={6} width="100%">
              <FormControl
                isInvalid={
                  createMachroomFormik?.touched &&
                  createMachroomFormik?.errors?.name
                    ? true
                    : false
                }
                isRequired
                w="100%"
              >
                <FormControl.Label fontWeight="bold">
                  <Heading fontSize={16}>Nome da partida</Heading>
                </FormControl.Label>
                <Input
                  px="4"
                  size="md"
                  type="text"
                  maxLength={70}
                  variant="rounded"
                  backgroundColor="white"
                  value={createMachroomFormik.values.name}
                  isDisabled={createMachroomFormik.isSubmitting}
                  onBlur={() => createMachroomFormik.handleBlur("name")}
                  onChangeText={(val) =>
                    createMachroomFormik.setFieldValue("name", val)
                  }
                />

                {createMachroomFormik.errors?.name &&
                  createMachroomFormik.touched?.name && (
                    <FormControl.ErrorMessage>
                      {createMachroomFormik.errors.name}
                    </FormControl.ErrorMessage>
                  )}
              </FormControl>

              <FormControl
                isInvalid={
                  createMachroomFormik?.touched &&
                  createMachroomFormik?.errors?.name
                    ? true
                    : false
                }
                w="100%"
              >
                <FormControl.Label fontWeight="bold">
                  <Heading fontSize={16}>Descrição</Heading>
                </FormControl.Label>
                <TextArea
                  px="4"
                  size="md"
                  type="text"
                  variant="rounded"
                  maxLength={100}
                  numberOfLines={2}
                  backgroundColor="white"
                  value={createMachroomFormik.values.description}
                  isDisabled={createMachroomFormik.isSubmitting}
                  onBlur={() => createMachroomFormik.handleBlur("description")}
                  onChangeText={(val) =>
                    createMachroomFormik.setFieldValue("description", val)
                  }
                />

                {createMachroomFormik.errors?.description && (
                  <FormControl.ErrorMessage>
                    {createMachroomFormik.errors.description}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>

              {/* date and hour inputs */}
              <Box>
                <Stack direction="row" space={6}>
                  <FormControl
                    isInvalid={
                      createMachroomFormik?.touched &&
                      createMachroomFormik?.errors?.scheduled_date
                        ? true
                        : false
                    }
                    width="45%"
                  >
                    <FormControl.Label textAlign={"center"}>
                      <Heading fontSize={16}>Data</Heading>
                    </FormControl.Label>

                    <Pressable
                      onPress={() =>
                        !createMachroomFormik.isSubmitting
                          ? setDatePickerVisibility(!isDatePickerVisible)
                          : null
                      }
                    >
                      <Input
                        pl="4"
                        size="md"
                        type="text"
                        variant="rounded"
                        value={createMachroomFormik.values.scheduled_date}
                        backgroundColor="white"
                        style={{
                          elevation: 400,
                          shadowOffset: {
                            width: 4,
                            height: 5,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                        }}
                        isRequired={true}
                        isReadOnly={true}
                      />
                    </Pressable>

                    <DateTimePickerModal
                      mode="date"
                      locale="pt_PT"
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      onConfirm={(date) => {
                        createMachroomFormik.setFieldValue(
                          "scheduled_date",
                          `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
                        );

                        setDatePickerVisibility(false);
                      }}
                      onCancel={() =>
                        setDatePickerVisibility(!isDatePickerVisible)
                      }
                    />
                  </FormControl>

                  <FormControl
                    isInvalid={
                      createMachroomFormik?.touched &&
                      createMachroomFormik?.errors?.scheduled_hour
                        ? true
                        : false
                    }
                    width="45%"
                  >
                    <FormControl.Label textAlign="center">
                      <Heading fontSize={16}>Hora</Heading>
                    </FormControl.Label>

                    <Pressable
                      onPress={() =>
                        !createMachroomFormik.isSubmitting
                          ? setHourPickerVisibility(!isHourPickerVisible)
                          : null
                      }
                    >
                      <Input
                        pl="4"
                        size="md"
                        type="text"
                        isReadOnly={true}
                        isRequired={true}
                        variant="rounded"
                        value={createMachroomFormik.values.scheduled_hour}
                        backgroundColor="white"
                      />
                    </Pressable>

                    <DateTimePickerModal
                      mode="time"
                      locale="pt_PT"
                      isVisible={isHourPickerVisible}
                      onConfirm={(date) => {
                        const parseHour = `${date.getHours()}:${String(
                          date.getMinutes()
                        ).padStart(2, "0")}`;

                        const currentTime = dayjs();
                        const selectedDate = dayjs(
                          createMachroomFormik.values.scheduled_date,
                          "DD/MM/YYYY"
                        );

                        // TODO
                        //* this needs to be looked at
                        //* need to verify if the player chooses the same day is ongoing
                        //* if so they cant choose past hours (eg. its 1pm, cant chose 9am)

                        /* if (currentTime.isSame(selectedDate, "day")) {
                          console.log("GSA", dayjs(date).isBefore(currentTime));
                          if (dayjs(date).isBefore(currentTime)) {
                            createMachroomFormik.setFieldError(
                              "scheduled_hour",
                              "Tens de escolher uma hora válida"
                            );
                          }

                          createMachroomFormik.setFieldError(
                            "scheduled_hour",
                            undefined
                          );

                          createMachroomFormik.setFieldValue(
                            "scheduled_hour",
                            parseHour
                          );
                        } else {
                          createMachroomFormik.setFieldError(
                            "scheduled_hour",
                            undefined
                          );
                        } */

                        createMachroomFormik.setFieldValue(
                          "scheduled_hour",
                          parseHour
                        );

                        setHourPickerVisibility(false);
                      }}
                      onCancel={() =>
                        setHourPickerVisibility(!isHourPickerVisible)
                      }
                    />
                  </FormControl>
                </Stack>

                {(createMachroomFormik.errors?.scheduled_date ||
                  createMachroomFormik.errors?.scheduled_hour) &&
                  (createMachroomFormik.touched?.scheduled_date ||
                    createMachroomFormik.touched?.scheduled_hour) && (
                    <Text mt="2" color="error.500" fontSize="xs">
                      {createMachroomFormik.errors?.scheduled_date ||
                        createMachroomFormik.errors?.scheduled_hour}
                    </Text>
                  )}
              </Box>

              {/* estimated duration input */}
              <FormControl
                isInvalid={
                  createMachroomFormik?.touched &&
                  createMachroomFormik?.errors?.estimated_duration
                    ? true
                    : false
                }
                w="100%"
              >
                <FormControl.Label>
                  <Heading fontSize={16}>Duração estimada</Heading>
                </FormControl.Label>
                <SelectInput
                  mt={1}
                  isDisabled={createMachroomFormik.isSubmitting}
                  selectedValue={createMachroomFormik.values.estimated_duration}
                  accessibilityLabel="O número minímo de jogadores"
                  onValueChange={(itemValue) =>
                    createMachroomFormik.setFieldValue(
                      "estimated_duration",
                      itemValue
                    )
                  }
                >
                  {[
                    "10 minutos",
                    "20 minutos",
                    "30 minutos",
                    "45 minutos",
                    "60 minutos",
                    "90 minutos",
                    "120 minutos",
                    "4 horas",
                    "6 horas",
                    "O dia todo",
                    "Vários dias",
                  ].map((item) => (
                    <Select.Item
                      key={item}
                      label={`${item}`}
                      value={`${item}`}
                    />
                  ))}
                </SelectInput>
                {createMachroomFormik.errors?.estimated_duration &&
                  createMachroomFormik.touched?.estimated_duration && (
                    <FormControl.ErrorMessage>
                      {createMachroomFormik.errors.estimated_duration}
                    </FormControl.ErrorMessage>
                  )}
              </FormControl>

              {/* matchroom type radio */}
              <FormControl>
                <FormControl.Label>
                  <Heading fontSize={16}>Tipo de Partida</Heading>
                </FormControl.Label>
                <Radio.Group
                  name="private"
                  accessibilityLabel="tipo de partida"
                  defaultValue="publica"
                  onChange={(newValue) => {
                    createMachroomFormik.setFieldValue("private", newValue);
                  }}
                  value={createMachroomFormik.values.private}
                >
                  <HStack mt={2} space={4} w="100%">
                    <Radio
                      size="md"
                      value="publica"
                      colorScheme="brand"
                      isDisabled={createMachroomFormik.isSubmitting}
                    >
                      Pública
                    </Radio>
                    <Radio
                      size="md"
                      value="privada"
                      colorScheme="brand"
                      isDisabled={createMachroomFormik.isSubmitting}
                    >
                      Privada
                    </Radio>
                  </HStack>
                </Radio.Group>
              </FormControl>

              <Divider mx="auto" my="2" color="gray.300" w="85%" />

              <Box>
                <Heading fontSize={18} pb="4">
                  Jogadores
                </Heading>
                <Stack direction="row" mt="2" space={6}>
                  <FormControl
                    isInvalid={
                      createMachroomFormik?.touched &&
                      createMachroomFormik?.errors?.min_players
                        ? true
                        : false
                    }
                    w="45%"
                  >
                    <FormControl.Label>
                      <Heading fontSize={16}>Nrº minímo</Heading>
                    </FormControl.Label>
                    <SelectInput
                      mt={1}
                      isDisabled={createMachroomFormik.isSubmitting}
                      selectedValue={createMachroomFormik.values.min_players}
                      accessibilityLabel="O número minímo de jogadores"
                      onValueChange={(itemValue) =>
                        createMachroomFormik.setFieldValue(
                          "min_players",
                          itemValue
                        )
                      }
                      _selectedItem={{
                        color: "red.100",
                        bg: "brand.500",
                        startIcon: (
                          <Icon mr={2} size={4} name="check" as={Feather} />
                        ),
                      }}
                      dropdownIcon={
                        <Icon
                          mr={4}
                          size={5}
                          as={Ionicons}
                          color="gray.300"
                          name="chevron-down-outline"
                        />
                      }
                    >
                      {Array.from({ length: 7 }, (_, i) => i + 2).map(
                        (item) => (
                          <Select.Item
                            key={item}
                            label={`${item}`}
                            value={`${item}`}
                          />
                        )
                      )}
                    </SelectInput>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      createMachroomFormik?.touched &&
                      createMachroomFormik?.errors?.max_players
                        ? true
                        : false
                    }
                    w="45%"
                  >
                    <FormControl.Label>
                      <Heading fontSize={16}>Nrº máximo</Heading>
                    </FormControl.Label>
                    <Select
                      px={4}
                      mt={1}
                      pr={10}
                      size="md"
                      variant="rounded"
                      backgroundColor="white"
                      isDisabled={createMachroomFormik.isSubmitting}
                      selectedValue={createMachroomFormik.values.max_players}
                      accessibilityLabel="O número máximo de jogadores"
                      onValueChange={(itemValue) =>
                        createMachroomFormik.setFieldValue(
                          "max_players",
                          itemValue
                        )
                      }
                      _selectedItem={{
                        color: "red.100",
                        bg: "brand.500",
                        startIcon: (
                          <Icon mr={2} size={4} name="check" as={Feather} />
                        ),
                      }}
                      dropdownIcon={
                        <Icon
                          mr={4}
                          size={5}
                          as={Ionicons}
                          color="gray.300"
                          name="chevron-down-outline"
                        />
                      }
                    >
                      {Array.from(
                        {
                          length: 7,
                        },
                        (_, i) =>
                          createMachroomFormik.values.min_players !== ""
                            ? i + +createMachroomFormik.values.min_players + 1
                            : i + 2
                      ).map((item) => (
                        <Select.Item
                          key={item}
                          label={`${item}`}
                          value={`${item}`}
                        />
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                {(createMachroomFormik.errors?.max_players ||
                  createMachroomFormik.errors?.min_players) &&
                  (createMachroomFormik.touched?.max_players ||
                    createMachroomFormik.touched?.min_players) && (
                    <Text mt="2" color="error.500" fontSize="xs">
                      {createMachroomFormik.errors?.max_players ||
                        createMachroomFormik.errors?.min_players}
                    </Text>
                  )}
              </Box>
            </VStack>

            <Flex pt={10} direction="row" justifyContent="center">
              <Btn
                minWidth={40}
                width={40}
                variant="solid"
                isLoading={createMachroomFormik.isSubmitting}
                onPress={
                  createMachroomFormik.handleSubmit as (values: any) => void
                }
              >
                Criar Partida
              </Btn>
            </Flex>
          </Box>
        </Box>
        <LoadingModal
          condition={createMachroomFormik.isSubmitting}
          message={`A criar a partida ${createMachroomFormik.values.name}...`}
        />
      </ScrollView>
    </>
  );
};

export default CreateMatchroomScreen;
