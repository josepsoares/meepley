import * as Yup from "yup";

const editProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, "O teu nome tem de possuir pelo menos 6 caracteres")
    .max(75, "O teu nome não pode ultrapassar os 75 caracteres")
    .matches(
      /^[aA-zZ\s]+$/,
      "O nome não pode possuir caracteres especiais nem números"
    ),
  username: Yup.string()
    .min(6, "O teu username tem de possuir pelo menos 6 caracteres")
    .max(25, "O teu username não pode ultrapassar os 50 caracteres")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "O username não pode possuir caracteres especiais nem espaços"
    ),
  title: Yup.string(),
  avatar: Yup.string(),
});

export default editProfileSchema;
