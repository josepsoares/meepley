import React from "react";
import { Center, Image, Text } from "native-base";

const ErrorSection: React.FC<{
  err: any;
  customMessage?: string | JSX.Element;
  custom404Message?: string | JSX.Element;
}> = ({ err, customMessage, custom404Message }) => {
  const notFoundMessage =
    custom404Message || "O que estavas à procura não existe!";

  return (
    <Center>
      <Image
        h="40"
        mt={5}
        w="100%"
        resizeMode="contain"
        alt="Ilustração de erro"
        accessibilityRole="image"
        source={require("../../assets/images/error/error-section.png")}
      />
      <Text
        mt="4"
        fontSize="18"
        accessibilityRole="text"
        textAlign="center"
        fontWeight="medium"
      >
        {customMessage
          ? customMessage
          : err?.status
          ? err?.status === 404
            ? notFoundMessage
            : err?.status === 401
            ? "Não tens autorização para ver este conteúdo"
            : "Aconteceu algo de errado! Por favor tenta novamente mais tarde"
          : "Aconteceu algo de errado! Por favor tenta novamente mais tarde"}
      </Text>
    </Center>
  );
};

export default ErrorSection;
