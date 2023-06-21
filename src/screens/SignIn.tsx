import {
  VStack,
  Text,
  Image,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { LoginSchema, SignInDTO } from "@dtos/AuthDTO";

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInDTO>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { onSignIn } = useAuth();
  const { show } = useToast();

  function handleNavigationToSignUp() {
    navigation.navigate("SignUp");
  }

  async function handleSignIn({ email, password }: SignInDTO) {
    try {
      console.log("Authenticating user...", password);
      await onSignIn({ email, password });
      console.log("User authenticated!");

      show({
        title: "User succesfully authenticated!",
        placement: "top",
        bg: "green.500",
        duration: 3000,
      });
    } catch (error: any) {
      // Check if error is a treated error with a nicely formatted error message
      const isAppError = error instanceof AppError;

      const message = isAppError
        ? error.message
        : "Something went wrong. Try again later.";

      return show({
        title: message,
        placement: "top",
        bg: "red.500",
        duration: 3000,
      });
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
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
            mb={4}
            fontFamily={"heading"}
          >
            Sign In
          </Heading>

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
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                  returnKeyLabel="Sign in"
                />
              </>
            )}
          />
          <Button
            title="Sign in"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          />
        </Center>

        <Center mt={24} style={{ gap: 12 }}>
          <Text color={"white"} fontSize={"sm"}>
            Don't have an account?
          </Text>
          <Button
            variant={"outline"}
            title="Create an account"
            onPress={handleNavigationToSignUp}
            isDisabled={isSubmitting}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
