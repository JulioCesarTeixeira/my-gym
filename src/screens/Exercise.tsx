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

type Props = NativeStackScreenProps<AppRoutes, "exercise">;

// todo implement API call to fetch exercise data

export function Exercise({ route, navigation }: Props) {
  const { id } = route.params;
  const { goBack } = useNavigation<AppRoutesProps>();

  function handleGoBack() {
    goBack();
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
          <Heading color="white" fontSize={"lg"} flexShrink={1} fontFamily={"heading"}>
            {id}
          </Heading>

          <HStack alignItems={"center"}>
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform={"capitalize"}>
              Back
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView>
        <VStack p={8}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534872850130-5355701fcc89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1348&q=80",
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
                  3 sets
                </Text>
              </HStack>
              <HStack alignItems={"center"}>
                <RepsSvg />
                <Text ml={2} color="gray.200">
                  12 reps
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
