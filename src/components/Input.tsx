import { Input as NBInput } from "native-base";

type InputProps = React.ComponentProps<typeof NBInput>;

export function Input({ ...props }: InputProps) {
  return (
    <NBInput
      bg={"gray.700"}
      h={12}
      px={4}
      mb={4}
      borderWidth={0}
      fontSize={"md"}
      color={"white"}
      fontFamily={"body"}
      placeholderTextColor={"gray.300"}
      _focus={{
        bg: "gray.700",
        borderColor: "green.500",
        borderWidth: 1,
      }}
      {...props}
    />
  );
}
