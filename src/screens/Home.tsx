import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesProps } from "@routes/app.routes";
import { Center, HStack, Text, VStack, FlatList, Heading } from "native-base";
import { useState } from "react";

export function Home() {
  const { navigate } = useNavigation<AppRoutesProps>();
  const [groups, setGroups] = useState([
    "back",
    "chest",
    "shoulders",
    "triceps",
    "biceps",
    "legs",
  ]);
  const [groupSelected, setGroupSelected] = useState("back");
  const [exercises, setExercises] = useState([
    {
      id: "1",
      name: "Lat pulldown",
      description: "3 x 12 reps - 60kg - 1 min rest",
      image:
        "https://images.unsplash.com/photo-1534872850130-5355701fcc89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1348&q=80",
    },
    {
      id: "2",
      name: "Pull up",
      description: "3 x 12 reps - bodyweight - 1 min rest",
      image:
        "https://images.unsplash.com/photo-1520334363269-c1b342d17261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=782&q=80",
    },
    {
      id: "3",
      name: "Chin up",
      description: "3 x 12 reps - bodyweight - 1 min rest",
      image:
        "https://images.unsplash.com/photo-1520334363269-c1b342d17261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=782&q=80",
    },
    {
      id: "4",
      name: "Deadlift",
      description: "3 x 12 reps - bodyweight - 1 min rest",
      image:
        "https://images.unsplash.com/photo-1520334363269-c1b342d17261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=782&q=80",
    },
  ]);

  function handleExerciseSelect(id: string) {
    navigate("exercise", {
      id,
    });
  }

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              name={item.name}
              description={item.description}
              image={item.image}
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
