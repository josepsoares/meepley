import React from "react";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "react-query";

import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Radio,
  Select,
  Text,
  VStack,
} from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";

import Btn from "../../../components/common/buttons/Btn";
import EmailInput from "../../../components/common/forms/EmailInput";
import PasswordInput from "../../../components/common/forms/PasswordInput";
import PrintToast from "../../../components/feedback/PrintToast";
import LoadingModal from "../../../components/feedback/LoadingModal";

import MeePleyAPI from "../../../services/api/meepley";
import registerEstablishmentSchema from "../../../utils/helpers/validation/registerEstablishmentSchema";

const RegisterEstablishmentForm: React.FC = () => {
  const navigation = useNavigation();

  const registerUser = useMutation(
    (data: {
      place: {} | null;
      email: string;
      username?: string;
      password: string;
    }) => MeePleyAPI.users.register(data)
  );

  const registerEstablishmentFormik = useFormik({
    validationSchema: registerEstablishmentSchema,
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      name: "",
      address: "",
      minimum_consumption: "no",
      latitude: 0,
      longitude: 0,
      city: "aveiro",
      sells_boardgames: "no",
      hours_open: "",
      terms_and_policy_confirmation: ["accept"],
    },
    onSubmit: async (values, actions) => {
      try {
        actions.setSubmitting(false);

        PrintToast({
          title: "Conta criada com sucesso!",
          status: "success",
        });

        navigation.goBack();
      } catch (err) {
        actions.setSubmitting(false);

        PrintToast({
          title: "Erro ao criar conta",
          status: "warning",
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
  } = registerEstablishmentFormik;

  return (
    <VStack space={6} width="100%">
      <Box pt={8}>
        <Text pb={2}>
          A conta de estabelecimento permite-te adicionar o teu estabelecimento
          na base de dados do MeePley, demonstrando que é um local recetivo a
          receber partidas de boardgames
        </Text>
        <Text>
          Se o estabelecimento que queres registar já se encontra no Google
          Places podes{" "}
          <Text
            underline
            color="brand.600"
            onPress={() => navigation.navigate("Register")}
          >
            carregar aqui
          </Text>{" "}
          e procurá-lo para agilizar o processo de registo
        </Text>
      </Box>

      <EmailInput
        isRequired={true}
        value={values.email}
        error={errors.email}
        touched={touched.email}
        {...{ setFieldValue, handleBlur }}
      />

      <PasswordInput
        isRequired={true}
        name="password"
        label="Password"
        value={values.password}
        error={errors.password}
        touched={touched.password}
        {...{ handleChange, handleBlur }}
      />

      <PasswordInput
        isRequired={true}
        label="Reinserir Password"
        name="password_confirmation"
        value={values.password_confirmation}
        error={errors.password_confirmation}
        touched={touched.password_confirmation}
        {...{ handleChange, handleBlur }}
      />

      <FormControl w="100%" maxW="300px" isRequired={true}>
        <FormControl.Label>Nome do Estabelecimento</FormControl.Label>
        <Input
          px="4"
          size="md"
          type="text"
          variant="rounded"
          backgroundColor="white"
          value={values.name}
          isDisabled={isSubmitting}
          onBlur={() => handleBlur("name")}
          onChangeText={(val) => setFieldValue("name", val)}
        />
      </FormControl>

      <FormControl w="100%" maxW="300px" isRequired={true}>
        <FormControl.Label>Rua do Estabelecimento</FormControl.Label>
        <Input
          px="4"
          size="md"
          type="text"
          variant="rounded"
          backgroundColor="white"
          value={values.address}
          isDisabled={isSubmitting}
          onBlur={() => handleBlur("address")}
          onChangeText={(val) => setFieldValue("address", val)}
        />
      </FormControl>

      <FormControl w="100%" maxW="300px" isRequired={true}>
        <FormControl.Label>Cidade do Estabelecimento</FormControl.Label>
        <Select
          mt={1}
          px={4}
          pr={10}
          size="md"
          minWidth="200"
          variant="rounded"
          backgroundColor="white"
          isDisabled={isSubmitting}
          selectedValue={values.city}
          accessibilityLabel="A cidade onde pertence o estabelecimento"
          onValueChange={(val) => setFieldValue("city", val)}
          _selectedItem={{
            bg: "brand.500",
            startIcon: <Icon mr={2} size={4} name="check" as={Feather} />,
            _text: {
              color: "white",
            },
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
          <Select.Item label="Aveiro" value="aveiro" />
          <Select.Item label="Porto" value="porto" />
          <Select.Item label="Lisboa" value="lisboa" />
          <Select.Item label="Braga" value="braga" />
          <Select.Item label="Faro" value="faro" />
          <Select.Item label="Viseu" value="viseu" />
          <Select.Item label="Coimbra" value="coimbra" />
        </Select>
      </FormControl>

      <FormControl w="100%" maxW="300px" isRequired={true}>
        <FormControl.Label>Consumo Minímo</FormControl.Label>

        <Select
          mt={1}
          px={4}
          pr={10}
          size="md"
          minWidth="200"
          variant="rounded"
          backgroundColor="white"
          isDisabled={isSubmitting}
          selectedValue={values.minimum_consumption}
          accessibilityLabel="O tipo de consumo minímo para o estabelecimento"
          onValueChange={(val) => setFieldValue("minimum_consumption", val)}
          _selectedItem={{
            bg: "brand.500",
            startIcon: <Icon mr={2} size={4} name="check" as={Feather} />,
            _text: {
              color: "white",
            },
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
          <Select.Item label="Nenhum" value="none" />
          <Select.Item label="0.50€" value="0.50" />
          <Select.Item label="0.75€" value="0.75" />
          <Select.Item label="1€" value="1" />
          <Select.Item label="1.50€" value="1.50" />
          <Select.Item label="2€" value="2" />
          <Select.Item label="2.50€" value="2.50" />
          <Select.Item label="5€" value="5" />
        </Select>
      </FormControl>
      <FormControl w="100%" maxW="300px" isRequired={true}>
        <FormControl.Label>Vendes Boardgames?</FormControl.Label>
        <Radio.Group
          value="no"
          name="myRadioGroup"
          colorScheme="brand"
          accessibilityLabel="Venda de Boardgames"
          onChange={(nextValue) => {}}
        >
          <Radio colorScheme="brand" value="yes" my={1}>
            Sim
          </Radio>
          <Radio colorScheme="brand" value="no" my={1}>
            Não
          </Radio>
        </Radio.Group>
      </FormControl>
      <FormControl w="100%" maxW="300px" isRequired={false}>
        <FormControl.Label>Imagens do Estabelecimento</FormControl.Label>
        <Btn
          mt="4"
          mx="auto"
          minWidth={40}
          variant="outline"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          onPress={() => handleSubmit}
          leftIcon={<Icon mr={1} size={5} as={Feather} name="upload" />}
        >
          Carregar imagens
        </Btn>
      </FormControl>

      <FormControl w="100%" pt={6} isRequired={true}>
        <Checkbox.Group
          value={values.terms_and_policy_confirmation}
          accessibilityLabel="Aviso acerca dos termos e política de privacidade"
          defaultValue={["accept"]}
          onChange={(val) =>
            setFieldValue("terms_and_policy_confirmation", val)
          }
        >
          <Checkbox
            mx="auto"
            value="accept"
            colorScheme="brand"
            icon={<Icon as={Feather} name="check" />}
            _checked={{
              value: "",
              backgroundColor: "brand.300",
            }}
            _text={{
              ml: 4,
              fontSize: 15,
            }}
          >
            Aceito os Termos e a Política de Privacidade
          </Checkbox>
        </Checkbox.Group>

        {touched.terms_and_policy_confirmation &&
          errors.terms_and_policy_confirmation && (
            <FormControl.ErrorMessage>
              {errors?.terms_and_policy_confirmation}
            </FormControl.ErrorMessage>
          )}
      </FormControl>

      <Divider w="75%" mx="auto" my="2" />

      <Flex direction="row" justifyContent="center" pb={6}>
        <Btn
          minWidth={40}
          width={40}
          variant="solid"
          bgColor="gray.500"
          isDisabled={true ? true : isSubmitting}
          isLoading={isSubmitting}
          onPress={() => handleSubmit}
        >
          Registar
        </Btn>
      </Flex>

      <LoadingModal
        condition={registerUser.isLoading}
        message="Aguarda uns instantes enquanto criamos a tua conta..."
      />
    </VStack>
  );
};

export default RegisterEstablishmentForm;
