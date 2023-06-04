import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  ScrollView,
  Text,
  VStack,
  Skeleton,
  Heading,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;
export function Profile() {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  return (
    <VStack flex={1}>
      <ScreenHeader name="Profile" />
      <ScrollView>
        <Center mt={6} px={10}>
          {isPhotoLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded={"full"}
              startColor={"gray.400"}
              endColor={"gray.500"}
            />
          ) : (
            <UserPhoto
              size={PHOTO_SIZE}
              source={{ uri: "https://github.com/JulioCesarTeixeira.png" }}
              alt={"User profile photo"}
            />
          )}
          <TouchableOpacity onPress={() => setIsPhotoLoading(!isPhotoLoading)}>
            <Text
              color={"green.500"}
              fontSize={"md"}
              fontWeight={"bold"}
              mt={2}
              mb={8}
            >
              Choose new photo
            </Text>
          </TouchableOpacity>

          <Input placeholder={"Name"} bg={"gray.600"} />
          <Input
            placeholder={"julio@placeholder.com"}
            bg={"gray.600"}
            isDisabled
          />
        </Center>
        <VStack px={10} mt={8} mb={20}>
          <Heading
            color={"gray.200"}
            fontSize={"md"}
            fontFamily={"heading"}
            mb={2}
          >
            Change password
          </Heading>
          <Input placeholder={"Old password"} bg={"gray.600"} secureTextEntry />
          <Input placeholder={"New password"} bg={"gray.600"} secureTextEntry />
          <Input
            placeholder="Confirm password"
            bg={"gray.600"}
            secureTextEntry
          />

          <Button title={"Confirm"} variant={"solid"} mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
