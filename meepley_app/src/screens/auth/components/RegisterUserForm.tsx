import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { useMutation } from "react-query";

import {
  Checkbox,
  Flex,
  FormControl,
  Icon,
  Input,
  Text,
  VStack,
} from "native-base";
import { Feather } from "@expo/vector-icons";

import Btn from "../../../components/common/buttons/Btn";
import EmailInput from "../../../components/common/forms/EmailInput";
import PasswordInput from "../../../components/common/forms/PasswordInput";
import PrintToast from "../../../components/feedback/PrintToast";
import LoadingModal from "../../../components/feedback/LoadingModal";

import MeePleyAPI from "../../../services/api/meepley";
import registerUserSchema from "../../../utils/helpers/validation/registerUserSchema";

const RegisterUserForm: React.FC = () => {
  const navigation = useNavigation();

  const registerUser = useMutation(
    (data: { email: string; username?: string; password: string }) =>
      MeePleyAPI.users.register(data)
  );

  const registerUserFormik = useFormik({
    validationSchema: registerUserSchema,
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      password_confirmation: "",
      age_confirmation: ["accept"],
      terms_and_policy_confirmation: ["accept"],
    },
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true);

      try {
        registerUser.mutate({
          email: values.email,
          username: values.username,
          password: values.password,
        });

        PrintToast({
          title: "Partida criada com sucesso!",
          status: "success",
        });

        actions.setSubmitting(false);

        navigation.goBack();
      } catch (err) {
        actions.setSubmitting(false);

        PrintToast({
          title: "Erro ao criar partida",
          status: "warning",
        });
      }
    },
  });

  const { handleBlur, handleChange, setFieldValue, touched, errors, values } =
    registerUserFormik;

  console.log(errors);

  return (
    <VStack space="6" width="100%">
      <Text pt="8">
        {true
          ? "A conta para um utilizador normal. Permite-te criar partidas, entrar em partidas, ver lista de jogos de tabuleiro, conquistar proezas e cartas colecionavéis etc. "
          : "A conta para um utilizador normal. Permite-te criar até 3 partidas, entrar em partidas, ver lista de jogos de tabuleiro, conquistar proezas e cartas colecionavéis etc."}
      </Text>

      <EmailInput
        isRequired={true}
        value={values.email}
        error={errors.email}
        touched={touched.email}
        {...{ setFieldValue, handleBlur }}
      />

      <FormControl
        w="100%"
        isRequired={true}
        isInvalid={touched.name && errors.name ? true : false}
      >
        <FormControl.Label>Nome</FormControl.Label>
        <Input
          px={4}
          type="text"
          fontSize="sm"
          variant="rounded"
          value={values.name}
          isRequired={true}
          autoCapitalize="words"
          backgroundColor="white"
          onBlur={handleBlur("name")}
          onChangeText={(val) => setFieldValue("name", val)}
          isInvalid={touched.name && errors.name ? true : false}
        />

        {touched.name && errors.name && (
          <FormControl.ErrorMessage>{errors?.name}</FormControl.ErrorMessage>
        )}
      </FormControl>

      <FormControl
        w="100%"
        isInvalid={touched.username && errors.username ? true : false}
      >
        <FormControl.Label>Username</FormControl.Label>
        <Input
          px={4}
          type="text"
          fontSize="sm"
          variant="rounded"
          isRequired={true}
          value={values.username}
          autoCapitalize="none"
          backgroundColor="white"
          onBlur={handleBlur("username")}
          onChangeText={(val) => setFieldValue("username", val)}
          isInvalid={touched.username && errors.username ? true : false}
        />

        {touched.username && errors.username && (
          <FormControl.ErrorMessage>
            {errors?.username}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

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
        touched={touched.password}
        {...{ handleChange, handleBlur }}
      />

      <FormControl
        w="100%"
        isRequired={true}
        isInvalid={errors.age_confirmation ? true : false}
      >
        <Checkbox.Group
          defaultValue={["accept"]}
          value={values.age_confirmation}
          onChange={(val) => setFieldValue("age_confirmation", val)}
        >
          <Checkbox
            value="accept"
            colorScheme="brand"
            icon={<Icon as={Feather} name="check" />}
            accessibilityLabel="Confirmação se tem mais de 18 anos"
            _checked={{
              value: "",
              backgroundColor: "brand.300",
            }}
            _text={{
              ml: 4,
              fontSize: 15,
            }}
          >
            Tenho mais de 18 anos
          </Checkbox>
        </Checkbox.Group>

        {errors.age_confirmation && (
          <FormControl.ErrorMessage mx="auto">
            {errors?.age_confirmation}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <FormControl
        w="100%"
        isRequired={true}
        isInvalid={errors.terms_and_policy_confirmation ? true : false}
      >
        <Checkbox.Group
          defaultValue={["accept"]}
          value={values.terms_and_policy_confirmation}
          onChange={(val) =>
            setFieldValue("terms_and_policy_confirmation", val)
          }
        >
          <Checkbox
            value="accept"
            colorScheme="brand"
            icon={<Icon as={Feather} name="check" />}
            accessibilityLabel="Aviso acerca dos termos e política de privacidade"
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

        {errors?.terms_and_policy_confirmation && (
          <FormControl.ErrorMessage mx="auto">
            {errors?.terms_and_policy_confirmation}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <Flex direction="row" justifyContent="center" pb={6}>
        <Btn
          minWidth={40}
          width={40}
          variant="solid"
          onPress={() => registerUserFormik.handleSubmit(values as any)}
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

export default RegisterUserForm;
