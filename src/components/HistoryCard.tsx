import { HStack, Heading, Image, VStack, Text, Icon } from "native-base";

type Props = {
  name: string;
  description: string;
  time?: Date;
};

export function HistoryCard({ name, description, time }: Props) {
  return (
    <HStack
      bg={"gray.500"}
      alignItems={"center"}
      p={4}
      pr={4}
      mb={3}
      rounded="md"
    >
      <VStack flex={1} mr={5}>
        <Heading
          fontSize={"lg"}
          color="white"
          fontFamily={"heading"}
          textTransform={"capitalize"}
        >
          {name}
        </Heading>

        <Text color="gray.200" fontSize={"md"} mt={1} numberOfLines={1}>
          {description}
        </Text>
      </VStack>

      <Text color="gray.200" fontSize={"md"} mt={1} numberOfLines={1}>
        {time?.toString() ?? "1hr ago"}
      </Text>
    </HStack>
  );
}
