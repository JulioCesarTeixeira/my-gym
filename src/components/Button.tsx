import { Button as NBButton, Text, IButtonProps } from "native-base";

type Props = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...props }: Props) {
  return (
    <NBButton
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor={"green.500"}
      h={12}
      w={"full"}
      rounded={"sm"}
      borderRadius={8}
      _text={{
        fontSize: "md",
        color: "white",
        fontFamily: "body",
      }}
      _pressed={{
        bg: variant === "outline" ? "gray.500" : "green.500",
      }}
      {...props}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily={"heading"}
        fontSize={"sm"}
      >
        {title}
      </Text>
    </NBButton>
  );
}
