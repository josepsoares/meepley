import React from "react";
import { Flex, Heading, Text } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSnapshot } from "valtio";

import Emoji from "../../components/common/Emoji";
import MatchroomBottomTab from "./components/MatchroomBottomTab";

import authStore from "../../services/store/authStore";
import { StackParamList } from "../../navigation";

type TMatchroomChatScreenProps = NativeStackScreenProps<
  StackParamList,
  "MatchroomChatScreen"
>;

const MatchroomChatScreen: React.FC<TMatchroomChatScreenProps> = ({
  navigation,
  route,
}) => {
  const { matchroomId } = route.params;
  const { user } = useSnapshot(authStore);

  return (
    <Flex px="10" h="full" bgColor="white">
      {/* Matchroom Section */}
      <Heading pt="8" pb="4">
        O nosso chat ainda se encontra em desenvolvimento...{" "}
        <Emoji emo="🚧" size={26} />
      </Heading>
      <Text>
        Passado uns turnos já deve estar pronto, por isso fica atento a
        atualizações das contas das nossas redes sociais!{" "}
        <Emoji emo="😉" size={18} />
      </Text>

      {/* Bottom Navigation Section */}
      {user && <MatchroomBottomTab userId={user.id} matchroomId={1} />}
    </Flex>
  );
};

export default MatchroomChatScreen;
