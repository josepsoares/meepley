import { useNavigation } from "@react-navigation/native";
import { VStack } from "native-base";

import Btn from "../../../../components/common/buttons/Btn";

const OnboardingInitialFooter = () => {
  const navigation = useNavigation();

  return (
    <VStack space={4}>
      <Btn
        w="75%"
        variant="outline"
        onPress={() => navigation.navigate("Register")}
      >
        Registar
      </Btn>
      <Btn w="75%" variant="solid" onPress={() => navigation.navigate("Login")}>
        Entrar
      </Btn>
    </VStack>
  );
};

export default OnboardingInitialFooter;
