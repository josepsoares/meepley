import React from "react";
import { Button, Flex, IBoxProps, IButtonProps } from "native-base";

const Btn = ({
  //@ts-ignore
  children,
  startIcon,
  rightIcon,
  leftIcon,
  endIcon,
  spinner,
  padding = 4,
  spinnerPlacement = "start",
  ...props
}: IButtonProps & IBoxProps) => {
  return (
    <Flex alignItems="center">
      <Button
        {...props}
        p={padding}
        borderRadius="30"
        colorScheme="brand"
        leftIcon={leftIcon ? leftIcon : undefined}
        rightIcon={rightIcon ? rightIcon : undefined}
        startIcon={startIcon ? startIcon : undefined}
        shadow={props?.variant === "solid" ? "4" : "none"}
        fontSize={8}
        _text={
          props?.variant === "solid"
            ? {
                color: "white",
                fontSize: props?.fontSize ? props.fontSize : "md",
              }
            : { fontSize: props?.fontSize ? props.fontSize : "md" }
        }
      >
        {children}
      </Button>
    </Flex>
  );
};

export default Btn;
