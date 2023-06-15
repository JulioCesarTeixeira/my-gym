import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseListSchema } from "@dtos/ExerciseDTO";
import { useRefreshByUser } from "@hooks/useRefreshByUser";
import { useRefreshOnFocus } from "@hooks/useRefreshOnFocus";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { useQuery } from "@tanstack/react-query";
import { AppError } from "@utils/AppError";
import {
  HStack,
  Text,
  VStack,
  FlatList,
  Heading,
  useToast,
  Skeleton,
  Box,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";

export function Home() {
  const { navigate } = useNavigation<AppRoutesProps>();
  const { show } = useToast();
  const [groupSelected, setGroupSelected] = useState("costas");
  const { isLoading: isLoadingGroups, data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroupsAll,
  });
  const {
    isLoading: isLoadingExercises,
    data: exercises,
    refetch: refetchExercises,
    isFetching: isFetchingExercises,
  } = useQuery({
    queryKey: ["exercises", groupSelected],
    queryFn: () => getExercisesByGroup(groupSelected),
  });

  const { isRefetchingByUser, refetchByUser } =
    useRefreshByUser(refetchExercises);
  useRefreshOnFocus(refetchExercises);

  async function getGroupsAll() {
    try {
      const response = await api.get<string[]>("/groups");
      const fetchedGroups = response.data;

      return fetchedGroups;
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

      return exercises;
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
        {isLoadingGroups ? (
          <FlatList
            horizontal
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => (
              <Box
                mr={4}
                w={24}
                h={10}
                p={4}
                bg="gray.600"
                rounded={"md"}
                justifyContent={"center"}
                alignItems={"center"}
                overflow={"hidden"}
              >
                <Skeleton.Text lines={1} fontSize={"xs"} size={10} />
              </Box>
            )}
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{ px: 8 }}
            my={10}
            maxHeight={10}
            minHeight={10}
          />
        ) : (
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
        )}
      </HStack>
      <VStack flex={1} px={8}>
        <HStack justifyContent={"space-between"} mb={5}>
          <Heading color={"gray.100"} fontSize={"md"} fontFamily={"heading"}>
            Exercises
          </Heading>

          <Text color={"gray.100"} fontSize={"md"}>
            {exercises?.length ?? 0}
          </Text>
        </HStack>
        {isLoadingExercises || isFetchingExercises ? (
          <FlatList
            data={[1, 2, 3, 4]}
            keyExtractor={(item) => String(item)}
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
            renderItem={() => (
              <HStack
                bg={"gray.500"}
                alignItems={"center"}
                p={2}
                pr={4}
                rounded="md"
                mb={3}
              >
                <Skeleton
                  w={16}
                  h={16}
                  mr={4}
                  rounded="md"
                  startColor="coolGray.100"
                />
                <VStack flex={1}>
                  <Skeleton.Text lines={2} />
                </VStack>
              </HStack>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 20 }}
          />
        ) : (
          <FlatList
            data={exercises}
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
            refreshControl={
              <RefreshControl
                refreshing={isFetchingExercises}
                onRefresh={refetchExercises}
              />
            }
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
        )}
      </VStack>
    </VStack>
  );
}
