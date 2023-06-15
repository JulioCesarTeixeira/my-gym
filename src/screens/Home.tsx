import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseListSchema, ExerciseDTO } from "@dtos/ExerciseDTO";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { HStack, Text, VStack, FlatList, Heading, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";

export function Home() {
  const { navigate } = useNavigation<AppRoutesProps>();
  const { show } = useToast();

  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("costas");
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  async function getGroupsAll() {
    try {
      const response = await api.get<string[]>("/groups");
      const fetchedGroups = response.data;

      setGroups(fetchedGroups);
    } catch (error: any) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Something went wrong when trying to get muscle groups :(";

      show({
        title,
        bgColor: "red.500",
        placement: "top",
      });
    }
  }

  async function getExercisesByGroup(group: string) {
    try {
      const response = await api.get(`/exercises/bygroup/${group}`);
      const fetchedExercises = response.data;

      const exercises = ExerciseListSchema.parse(fetchedExercises);

      setExercises(exercises);
    } catch (error: any) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Something went wrong when trying to get exercises :(";

      show({
        title,
        bgColor: "red.500",
        placement: "top",
      });
    }
  }

  function handleExerciseSelect(id: number) {
    navigate("exercise", {
      id: String(id),
    });
  }

  useEffect(() => {
    getGroupsAll();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getExercisesByGroup(groupSelected);
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />
      <HStack>
        <FlatList
          horizontal
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Group
              name={item}
              isActive={item.toUpperCase() === groupSelected.toUpperCase()}
              onPress={() => setGroupSelected(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ px: 8 }}
          my={10}
          maxHeight={10}
          minHeight={10}
        />
      </HStack>
      <VStack flex={1} px={8}>
        <HStack justifyContent={"space-between"} mb={5}>
          <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
            Exercises
          </Heading>

          <Text color={"gray.100"} fontSize={"md"}>
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => `${item.name}-${item.id}`}
          renderItem={({ item }) => (
            <ExerciseCard
              name={item.name}
              repetitions={item.repetitions}
              series={item.series}
              demo={item.demo}
              thumb={item.thumb}
              onPress={() => handleExerciseSelect(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 20 }}
        />
      </VStack>
    </VStack>
  );
}
