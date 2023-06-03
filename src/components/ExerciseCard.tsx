import { HStack, Heading, Image, VStack, Text, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";

type Props = TouchableOpacityProps & {
  name: string;
  description: string;
  image: string;
};

export function ExerciseCard({ name, description, image, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={"gray.500"}
        alignItems={"center"}
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: image,
          }}
          alt="fitness image"
          width={16}
          height={16}
          mr={4}
          rounded={"md"}
        />

        <VStack flex={1}>
          <Heading fontSize={"lg"} color="white" fontFamily={"heading"}>
            {name}
          </Heading>

          <Text color="gray.200" fontSize={"sm"} mt={1} numberOfLines={2}>
            {description}
          </Text>
        </VStack>

        <Icon
          as={Entypo}
          name="chevron-thin-right"
          // size={7}
          color="gray.300"
          ml={"auto"}
        />
      </HStack>
    </TouchableOpacity>
  );
}
