import { HStack, Heading, Image, VStack, Text, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type Props = TouchableOpacityProps &
  Omit<ExerciseDTO, "id" | "created_at" | "updated_at" | "group">;

export function ExerciseCard({
  name,
  repetitions,
  series,
  demo,
  thumb,
  ...rest
}: Props) {
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
          // source={{
          //   uri: thumb,
          // }}
          fallbackSource={{ uri: "https://via.placeholder.com/150" }}
          alt="fitness image"
          width={16}
          height={16}
          resizeMode="cover"
          mr={4}
          rounded={"md"}
        />

        <VStack flex={1}>
          <Heading fontSize={"lg"} color="white" fontFamily={"heading"}>
            {name}
          </Heading>

          <Text color="gray.200" fontSize={"sm"} mt={1} numberOfLines={2}>
            Series {series} | Reps {repetitions}
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
