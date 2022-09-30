import React from "react";
import { VStack } from "native-base";

import Btn from "../../../../components/common/buttons/Btn";

const CalibrationFooter: React.FC<{
  isLastPage: boolean;
  changePage: () => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  concludeFunc: () => void;
}> = ({ isLastPage, changePage, setModal, concludeFunc }) => {
  return (
    <VStack space={4} pt={8} pb={6}>
      <Btn
        px="16"
        variant="solid"
        onPress={() => {
          if (isLastPage) {
            concludeFunc();
          } else {
            changePage();
          }
        }}
      >
        {isLastPage ? "Concluir" : "Próximo"}
      </Btn>
      <Btn variant="ghost" onPress={() => setModal(true)}>
        Cancelar calibração
      </Btn>
    </VStack>
  );
};

export default CalibrationFooter;
