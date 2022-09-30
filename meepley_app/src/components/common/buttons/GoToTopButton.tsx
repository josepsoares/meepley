import React from "react";
import { Fab, Icon } from "native-base";
import { AnimatePresence, MotiView } from "moti";
import { Feather } from "@expo/vector-icons";

const GoToTopButton: React.FC<{
  innerRef: React.MutableRefObject<any>;
  isVisible: boolean;
}> = ({ innerRef, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <MotiView
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          from={{ opacity: 0, display: "none" }}
          animate={{ display: "flex", opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Fab
            onPress={() =>
              innerRef.current?.scrollTo({
                y: 0,
                animated: true,
              })
            }
            size="sm"
            shadow={2}
            placement="bottom-right"
            renderInPortal={false}
            backgroundColor="brand.500"
            accessibilityRole="button"
            label="Voltar ao início da lista"
            icon={<Icon color="white" as={Feather} name="arrow-up" size="4" />}
            accessibilityHint="Carregar para voltar ao início da lista"
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default GoToTopButton;
