import { FormControl, Input } from "native-base";

interface EmailInputProps {
  isRequired?: boolean;
  value: string;
  error: string | undefined;
  touched: boolean | undefined;
  setFieldValue: any;
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}

const EmailInput: React.FC<EmailInputProps> = (props) => {
  const feedbackInvalid = props?.touched && props?.error ? true : false;

  return (
    <FormControl
      isInvalid={feedbackInvalid}
      isRequired={props.isRequired || false}
      w="100%"
      maxW="300px"
    >
      <FormControl.Label>Email</FormControl.Label>
      <Input
        px={4}
        value={props?.value}
        onChangeText={(val) => props?.setFieldValue("email", val.trim())}
        onBlur={props?.handleBlur("email")}
        isRequired={true}
        isInvalid={feedbackInvalid}
        backgroundColor="white"
        variant="rounded"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        fontSize="sm"
      />

      {feedbackInvalid && (
        <FormControl.ErrorMessage>{props?.error}</FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default EmailInput;
