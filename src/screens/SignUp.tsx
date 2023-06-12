import {
  VStack,
  Text,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { z } from "zod";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { SignUpDTO, signUpSchema } from "@dtos/AuthDTO";
import { useAuth } from "@hooks/useAuth";

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { show } = useToast();
  const { onSignUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpDTO>({
    reValidateMode: "onChange",
    resolver: zodResolver(signUpSchema),
  });

  function handleNavigationToSignIn() {
    navigation.goBack();
  }

  async function handleCreateAccount({
    name,
    email,
    password,
    password_confirm,
  }: SignUpDTO) {
    console.log({ name, email, password, password_confirm });

    try {
      console.log("Making request to create user...");
      await onSignUp({ name, email, password });

      console.log("User created successfully!");
      show({
        title: "User created successfully!",
        placement: "top",
        bg: "green.500",
        duration: 3000,
      });
    } catch (error: any) {
      const isAppError = error instanceof AppError;

      return show({
        title: isAppError ? error.message : "Something went wrong.",
        placement: "top",
        bg: "red.500",
        duration: 3000,
      });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={8}>
        <Image
          source={BackgroundImage}
          defaultSource={BackgroundImage}
          alt="People training in a gym"
          resizeMode="contain"
          position={"absolute"}
        />
        <Center my={24} fontSize={"sm"}>
          <LogoSvg />
          <Text color={"white"}>Train your mind and body</Text>
        </Center>

        <Center>
          <Heading
            color={"white"}
            fontSize={"xl"}
            fontFamily={"heading"}
            mb={6}
          >
            Create an account
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Name"
                  autoCorrect={false}
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
                  autoCorrect={false}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Password"
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
                  placeholder="Confirm password"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={error?.message}
                  onSubmitEditing={handleSubmit(handleCreateAccount)}
                  returnKeyType="send"
                />
              </>
            )}
          />

          <Button
            title="Create"
            onPress={handleSubmit(handleCreateAccount)}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </Center>

        <Button
          variant={"outline"}
          title="Back to login"
          mt={10}
          onPress={handleNavigationToSignIn}
          isDisabled={isSubmitting}
        />
      </VStack>
    </ScrollView>
  );
}
