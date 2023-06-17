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
  useToast,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { UserProfileDTO, userProfileDTOSchema } from "@dtos/UserDTO";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/useAuth";

const PHOTO_SIZE = 33;
export function Profile() {
  const { user } = useAuth();

  const { control, handleSubmit } = useForm<UserProfileDTO>({
    reValidateMode: "onBlur",
    resolver: zodResolver(userProfileDTOSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });
  const { show } = useToast();
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>(
    "https://github.com/JulioCesarTeixeira.png"
  );

  async function handlePickImage() {
    try {
      setIsPhotoLoading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        quality: 1,
        aspect: [4, 4],
      });

      if (selectedPhoto.canceled) return;

      if (selectedPhoto.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          selectedPhoto.assets[0].uri
        );

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 3) {
          return show({
            title: "Image size is too big",
            placement: "top",
            bg: "red.500",
            duration: 3000,
          });
        }

        console.log(photoInfo);

        setUserPhoto(selectedPhoto.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPhotoLoading(false);
    }
  }

  async function handleUpdateProfile(data: UserProfileDTO) {
    console.log(data);
  }
  return (
    <VStack flex={1}>
      <ScreenHeader name="Profile" />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
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
              source={{ uri: userPhoto }}
              alt={"User profile photo"}
            />
          )}
          <TouchableOpacity onPress={handlePickImage}>
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

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Name"
                  autoCorrect={false}
                  bg={"gray.600"}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  bg={"gray.600"}
                  autoCorrect={false}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                />
              </>
            )}
          />
        </Center>
        <VStack px={10} mt={12}>
          <Heading
            color={"gray.200"}
            fontSize={"md"}
            fontFamily={"heading"}
            mb={2}
          >
            Change password
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Old password"
                  bg={"gray.600"}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="new_password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="New password"
                  bg={"gray.600"}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Confirm new password"
                  bg={"gray.600"}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                  onSubmitEditing={handleSubmit(handleUpdateProfile)}
                  returnKeyType="send"
                />
              </>
            )}
          />

          <Button
            title={"Confirm"}
            variant={"solid"}
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
