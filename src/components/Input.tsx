import { Input as NBInput, IInputProps, FormControl } from "native-base";

type InputProps = IInputProps & {
  errorMessage?: string | null;
};

export function Input({
  errorMessage = null,
  isInvalid,
  ...props
}: InputProps) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NBInput
        bg={"gray.700"}
        h={12}
        px={4}
        // mb={4}
        borderWidth={0}
        fontSize={"md"}
        color={"white"}
        fontFamily={"body"}
        placeholderTextColor={"gray.300"}
        isInvalid={invalid}
        _invalid={{
          borderColor: "red.500",
          borderWidth: 1,
        }}
        _focus={{
          bg: "gray.700",
          borderColor: "green.500",
          borderWidth: 1,
        }}
        {...props}
      />
      <FormControl.ErrorMessage _text={{color: "red.500"}}>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
