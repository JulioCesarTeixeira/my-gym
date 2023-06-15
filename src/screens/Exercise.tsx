import {
  Center,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  Image,
  Box,
  ScrollView,
  useToast,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppRoutes, AppRoutesProps } from "@routes/app.routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO, ExerciseSchema } from "@dtos/ExerciseDTO";

type Props = NativeStackScreenProps<AppRoutes, "exercise">;

// todo implement API call to fetch exercise data

export function Exercise({ route, navigation }: Props) {
  const { id } = route.params;
  const { show } = useToast();
  const { data, isLoading, isFetching, refetch, error } = useQuery<ExerciseDTO>(
    {
      queryKey: ["exercise", id],
      queryFn: () => getExerciseById(id),
    }
  );

  const { name, series, repetitions, group, demo } = data || {};
  const { goBack } = useNavigation<AppRoutesProps>();

  function handleGoBack() {
    goBack();
  }

  async function getExerciseById(id: string) {
    try {
      const exercise = await api.get(`/exercises/${id}`);

      const parsedExercise = ExerciseSchema.parse(exercise.data);

      return parsedExercise;
    } catch (error: any) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Something went wrong when trying to get exercise :(";

      show({
        title,
        bgColor: "red.500",
        placement: "top",
      });
      throw error;
    }
  }

  return (
    <VStack flex={1}>
      <VStack px={8} pt={12} bg="gray.600">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" size={6} color={"green.500"} />
        </TouchableOpacity>
        <HStack
          justifyContent={"space-between"}
          mt={4}
          mb={8}
          alignItems={"center"}
        >
          <Heading
            color="white"
            fontSize={"lg"}
            flexShrink={1}
            fontFamily={"heading"}
          >
            {name}
          </Heading>

          <HStack alignItems={"center"}>
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform={"capitalize"}>
              {group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={8}>
          <Image
            source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${demo}`,
            }}
            alt={"Lat pulldown"}
            w="full"
            h={80}
            mb={3}
            rounded="lg"
            resizeMode="cover"
          />

          <Box bg={"gray.600"} rounded={"md"} px={4} py={4}>
            <HStack
              alignItems={"center"}
              justifyContent={"space-around"}
              mb={6}
            >
              <HStack alignItems={"center"}>
                <SeriesSvg />
                <Text ml={2} color="gray.200">
                  {series} sets
                </Text>
              </HStack>
              <HStack alignItems={"center"}>
                <RepsSvg />
                <Text ml={2} color="gray.200">
                  {repetitions} reps
                </Text>
              </HStack>
            </HStack>
            <Button title="Complete exercise" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
