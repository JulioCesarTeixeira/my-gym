import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack, Text } from "native-base";
import { useState } from "react";
import { SectionList } from "native-base";

export function History() {
  // const [exercises, setExercises] = useState([]);
  const [exercises, setExercises] = useState([
    {
      title: "Today",
      data: [
        {
          name: "Back",
          description: "Lat pulldown",
        },
        {
          description: "Lat pulldown",
          name: "Back",
        },
      ],
    },
    {
      title: "Yesterday",
      data: [
        {
          description: "Lat pulldown",
          name: "Back",
        },
        {
          description: "Lat pulldown",
          name: "Back",
        },
      ],
    },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader name={"History"} />

      <SectionList
        sections={exercises}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <HistoryCard name={item.name} description={item.description} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Heading
            fontSize={"md"}
            color="gray.200"
            fontFamily={"heading"}
            textTransform={"capitalize"}
            mt={4}
            mb={2}
          >
            {title}
          </Heading>
        )}
        contentContainerStyle={
          !exercises.length && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text
            color="gray.200"
            fontSize={"md"}
            mt={1}
            numberOfLines={2}
            textAlign={"center"}
          >
            No exercises yet. Let's do some?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
        px={6}
      />
    </VStack>
  );
}
