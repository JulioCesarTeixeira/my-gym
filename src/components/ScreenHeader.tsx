import { Center, Heading } from "native-base";

type Props = {
  name: string;
};

export function ScreenHeader({ name }: Props) {
  return (
    <Center bg={"gray.600"} pb={6} pt={16}>
      <Heading fontFamily={"heading"} color={"gray.100"} fontSize={"xl"}>
        {name}
      </Heading>
    </Center>
  );
}
