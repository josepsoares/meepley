import { useState } from "react";
import { FieldProps } from "formik";
import { FormControl, Icon, Input } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

interface PasswordInputProps {
  isRequired?: boolean;
  label: string;
  name: string;
  value: string;
  error: string | undefined;
  touched: boolean | undefined;
  handleChange: any;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const feedbackInvalid = props?.touched && props?.error ? true : false;

  return (
    <FormControl
      isInvalid={feedbackInvalid}
      isRequired={props.isRequired || false}
      w="100%"
      maxW="300px"
    >
      <FormControl.Label>{props?.label}</FormControl.Label>
      <Input
        px={4}
        value={props?.value}
        isRequired={true}
        isInvalid={feedbackInvalid}
        type={show ? "text" : "password"}
        variant="rounded"
        backgroundColor="white"
        onChangeText={props?.handleChange(props?.name)}
        onBlur={props?.handleBlur(props?.name)}
        fontSize="sm"
        InputRightElement={
          <Icon
            mr="4"
            size={5}
            color="muted.400"
            onPress={handleClick}
            as={MaterialIcons}
            name={show ? "visibility" : "visibility-off"}
          />
        }
      />

      {feedbackInvalid && (
        <FormControl.ErrorMessage>{props?.error}</FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default PasswordInput;
