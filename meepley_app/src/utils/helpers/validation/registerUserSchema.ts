import * as Yup from "yup";

const registerUserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email inválido")
    .required("Necessitas de inserir o teu email para realizar o registo"),
  name: Yup.string()
    .required("Necessitas de inserir o teu nome para realizar o registo")
    .min(4, "O teu nome tem de ter pelo menos quatro caracteres"),
  username: Yup.string().min(
    4,
    "O teu username tem de ter pelo menos quatro caracteres"
  ),
  password: Yup.string()
    .required(
      "Necessitas de inserir a tua palavra-passe para realizar o registo"
    )
    .min(8, "A tua password tem de ter pelo menos oito caracteres"),
  password_confirmation: Yup.string()
    .required(
      "Necessitas de inserir a tua password novamente para realizar o registo"
    )
    .oneOf([Yup.ref("password"), null], "As passwords têm de ser iguais"),
  age_confirmation: Yup.array()
    .required(
      "Necessitas de indicar se tens mais de 18 para realizar o registo"
    )
    .min(1, "Precisas de ter mais de 18 anos para realizar o registo")
    .default(["accept"]),
  terms_and_policy_confirmation: Yup.array()
    .required(
      "Necessitas de indicar se aceitas os Termos e a Política de Privacidade para realizar o registo"
    )
    .min(
      1,
      "Precisas de aceitar os Termos e a Política de Privacidade para realizar o registo"
    )
    .default(["accept"]),
});

export default registerUserSchema;
