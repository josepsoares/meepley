import React from "react";

import { Box, Heading, Modal, Text } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";

import TextWithIcon from "../common/IconWithText";

const PrivacyPolicyModal: React.FC<{
  modalVisible: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ modalVisible, setModal }) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Modal
        size="xl"
        isOpen={modalVisible}
        onClose={() => setModal(false)}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Heading>Política de Privacidade</Heading>
          </Modal.Header>
          <Modal.Body>
            <Box pb="4">
              <Text pb="2">
                Esta declaração de privacidade descreve meios pelos quais a
                MeePley, recolhe, mantém e utiliza informações sobre as pessoas
                individuais que utilizam esta aplicação.
              </Text>
              <Text>
                Solicitamos informações pessoais apenas quando realmente
                precisamos delas para lhe fornecer um serviço. Fazemo-lo por
                meios justos e legais, com o seu conhecimento e consentimento.
                Também informamos por que estamos a recolher e como será
                utilizado.
              </Text>
            </Box>
            <Box pb="4">
              <Heading pb="4">Quem deve utilizar a nossa aplicação</Heading>
              <Text>
                A nossa aplicação só deve ser utilizada{" "}
                <Text fontWeight="bold">
                  por pessoas com mais de 18 anos de idade
                </Text>
                . Sendo assim, crianças e adolescentes não devem utilizá-la.
              </Text>
            </Box>
            <Box pb="4">
              <Heading pb="4">Que dados recolhemos?</Heading>
              <Text pb="2">
                As categorias de dados pessoais que estão sujeitos a tratamento
                por parte da MeePley são os seguintes:
              </Text>
              <Box pl="4">
                {[
                  "Nome",
                  "Email",
                  "Username",
                  "Password",
                  "Avatar",
                  "Localização",
                  "Horário de funcionamento",
                ].map((item, i) => (
                  <TextWithIcon
                    key={i}
                    w="100%"
                    text={item}
                    padding={2}
                    accLabel={item}
                    align="flex-start"
                    iconName="chevron-right"
                    iconLibrary={FontAwesome5}
                  />
                ))}
              </Box>
            </Box>
            <Box pb="4">
              <Heading pb="4">Como recolhemos os dados?</Heading>
              <Text pb="2">
                O utilizador fornece diretamente à nossa aplicação a maioria dos
                dados que recolhemos. Recolhemos os dados e processamos os dados
                quando:
              </Text>
              <Box pl="4">
                {[
                  "Faz o registo na aplicação inserindo o e-mail e a password",
                  "Faz o registo na aplicação a partir do Google ou do Facebook",
                  "Utiliza a localização para saber e marcar as partidas dos jogos",
                ].map((item, i) => (
                  <TextWithIcon
                    key={i}
                    w="100%"
                    text={item}
                    padding={2}
                    accLabel={item}
                    align="flex-start"
                    iconName="chevron-right"
                    iconLibrary={FontAwesome5}
                  />
                ))}
              </Box>
            </Box>
            <Box pb="4">
              <Heading pb="4">Como vamos utilizar os dados?</Heading>
              <Text>
                Os seus dados pessoais são pedidos para que possa registar na
                aplicação, via respectivo formulário online disponibilizado na
                aplicação do MeePley para o efeito. Este formulário serve para
                poder criar partidas de jogo, para conseguir aceder aos eventos
                de jogo que estejam a decorrer, a localização dos mesmos.
              </Text>
            </Box>
            <Box pb="4">
              <Heading pb="4">Armazenamento dos dados</Heading>
              <Text pb="2">
                Nós iremos manter os teus dados pessoais somente pelo tempo que
                for necessário para cumprir com as finalidades de tratamento
                descritas na presente Política, ou para fins de cumprimento de
                quaisquer obrigações legais, contratuais, de prestação de contas
                ou requisição de autoridades competentes.
              </Text>
              <Text pb="2">
                Para determinar o período de retenção adequado para os dados
                pessoais, consideramos a natureza e a sensibilidade dos dados
                pessoais, bem como sua finalidade de tratamento.
              </Text>
              <Text>
                Após encerradas todas as finalidades que justificaram o
                tratamento dos dados pessoais, estes dados serão eliminados,
                observando os meios técnicos disponíveis.
              </Text>
            </Box>
            <Box pb="4">
              <Heading pb="4">
                Quais são os teus direitos de proteção de dados?
              </Heading>
              <Text pb="2">
                Queremos ter a certeza de que o utilizador está totalmente
                ciente de todos os teus direitos de proteção de dados. Os
                utilizadores têm o direito ao seguinte:
              </Text>
              <Box pl="4">
                {[
                  "O direito de acesso - O utilizador tem o direito de solicitar à nossa aplicação cópias dos seus dados pessoais e acesso aos mesmos",
                  "O direito de retificação - Tem direito de solicitar que a nossa aplicação corrija qualquer informação que o utilizador ache ser imprecisa",
                  "O direito de apagar - Tem o direito de solicitar que a MeePley apague os seus dados pessoais, sob certas condições.",
                  "Direito de solicitar à nossa aplicação que complete as informações que acredita estarem incompletas",
                ].map((item, i) => (
                  <TextWithIcon
                    key={i}
                    w="100%"
                    text={item}
                    padding={2}
                    accLabel={item}
                    align="flex-start"
                    iconName="chevron-right"
                    iconLibrary={FontAwesome5}
                  />
                ))}
              </Box>
            </Box>
            <Box pb="4">
              <Heading pb="4">Divulgação de seus dados pessoais</Heading>
              <Text>
                Aplicação da lei Sob certas circunstâncias, a MeePley pode ser
                obrigada a divulgar os seus dados pessoais se exigido por lei ou
                em resposta a solicitações válidas de autoridades públicas (por
                exemplo, um tribunal ou uma entidade governamental).
              </Text>
            </Box>
            <Box pb="4">
              <Heading pb="4">Como entrar em contato conosco</Heading>
              <Text>
                Caso tenha alguma questão ou reclamação a apresentar
                relativamente a esta Política de Privacidade, ou caso tenha
                alguma recomendação ou comentário no sentido de melhorar a
                qualidade da nossa Política de Privacidade, envie-nos um e-mail{" "}
                <Text fontWeight="bold">meepley.play.app@gmail.com</Text>
              </Text>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default PrivacyPolicyModal;
