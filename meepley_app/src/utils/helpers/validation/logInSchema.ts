import * as Yup from "yup";

const logInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email inválido")
    .required("Precisas de inserir o teu email para realizar o login"),
  password: Yup.string().required(
    "Precisas de inserir a tua palavra-passe para realizar o login"
  ),
});

export default logInSchema;
