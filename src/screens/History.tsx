import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack, Text } from "native-base";
import { SectionList } from "native-base";
import { useQuery } from "@tanstack/react-query";
import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryDTO";
import { RefreshControl } from "react-native";
import { Loading } from "@components/Loading";

export function History() {
  const {
    data: history = [],
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    refetch: refetchHistory,
  } = useQuery<HistoryByDayDTO[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api.get("/history");
      console.log(res.data);

      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    refetchOnReconnect: true,
  });

  return (
    <VStack flex={1}>
      <ScreenHeader name={"History"} />

      {isLoadingHistory ? (
        <Loading />
      ) : (
        <SectionList
          sections={history}
          refreshing={isFetchingHistory}
          onRefresh={refetchHistory}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingHistory}
              onRefresh={refetchHistory}
            />
          }
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <HistoryCard
              name={item.group}
              description={item.name}
              time={item.hour}
            />
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
            !history.length && { flex: 1, justifyContent: "center" }
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
          px={6}
        />
      )}
    </VStack>
  );
}
