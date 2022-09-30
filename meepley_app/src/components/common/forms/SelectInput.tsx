import { Feather, Ionicons } from "@expo/vector-icons";
import { Icon, ISelectProps, Select } from "native-base";
import React from "react";

const SelectInput = ({
  //@ts-ignore
  children,
  ...props
}: ISelectProps) => {
  return (
    <Select
      {...props}
      px="4"
      pr="4"
      size="md"
      variant="rounded"
      backgroundColor="white"
      _selectedItem={{
        bg: "brand.500",
        borderRadius: "2xl",
        _text: {
          color: "white",
          fontWeight: "medium",
        },
        startIcon: <Icon mr="1" size="4" name="check" as={Feather} />,
      }}
      dropdownIcon={
        <Icon
          mr="4"
          size="5"
          as={Ionicons}
          color="gray.300"
          name="chevron-down-outline"
        />
      }
    >
      {children}
    </Select>
  );
};

export default SelectInput;
