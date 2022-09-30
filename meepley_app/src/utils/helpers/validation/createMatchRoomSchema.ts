import * as Yup from "yup";

const createMatchroomFormSchema = Yup.object().shape({
  game: Yup.string().required("Precisas de selecionar um ou mais jogos"),
  place: Yup.string().required("Precisas de selecionar um local"),
  match_name: Yup.string()
    .required("Tens de escrever um nome para a partida")
    .min(4)
    .max(70),
  players_number: Yup.string().required("Precisas de uma data"),
  date: Yup.string().required("Precisas de uma data"),
  hour: Yup.string().required("Tens de escolher uma hora"),
  match_privacy: Yup.string().required(
    "É necessário especificar o tipo da partida"
  ),
});

export default createMatchroomFormSchema;
