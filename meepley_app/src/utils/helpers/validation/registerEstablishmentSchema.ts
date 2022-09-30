import * as Yup from "yup";

const registerEstablishmentSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email inválido")
    .required(
      "Necessitas de inserir o email do estabelecimento para realizar o registo"
    ),
  address: Yup.string().required(
    "Necessitas de inserir a morada do estabelecimento para realizar o registo"
  ),
  name: Yup.string().required(
    "Necessitas de inserir o nome do estabelecimento para realizar o registo"
  ),
  minimum_consumption: Yup.string().required(
    "Necessitas de indicar se será exigido consumo minímo no estabelecimento para realizar o registo"
  ),
  latitude: Yup.string().required(
    "Necessitas de inserir a latitude do estabelecimento para realizar o registo"
  ),
  longitude: Yup.string().required(
    "Necessitas de inserir a longitude estabelecimento para realizar o registo"
  ),
  city: Yup.string().required(
    "Necessitas de indicar a cidade onde se encontra o estabelecimento para realizar o registo"
  ),
  sells_boardgames: Yup.string().required(
    "Necessitas de indicar se o estabelecimento vende boardgames para realizar o registo"
  ),
  hours_open: Yup.string().required(
    "Necessitas de inserir as horas de funcionamento do estabelecimento para realizar o registo"
  ),
  password: Yup.string()
    .required("Necessitas de inserir uma palavra-passe para realizar o registo")
    .min(8, "A tua password tem de ter pelo menos oito caracteres"),
  password_confirmation: Yup.string()
    .required(
      "Necessitas de inserir a mesma password novamente para realizar o registo"
    )
    .oneOf([Yup.ref("password"), null], "As passwords têm de ser iguais"),
});

export default registerEstablishmentSchema;
