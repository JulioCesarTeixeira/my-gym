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
import { isAxiosError } from "axios";
import { AppError } from "@utils/AppError";

const signUpSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }).nonempty(),
    email: z
      .string({ required_error: "Email is required." })
      .nonempty("Email is required.")
      .email({ message: "Email is invalid." }),
    password: z
      .string({ required_error: "Password is required." })
      .nonempty("Password is required.")
      .min(6, { message: "Password must have at least 6 characters." }),
    password_confirm: z
      .string({ required_error: "Please, confirm your password." })
      .nonempty("Please, confirm your password.")
      .min(6),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords must match.",
    path: ["password_confirm"],
  });

type FormDataProps = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { show } = useToast();

  const { control, handleSubmit } = useForm<FormDataProps>({
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
  }: FormDataProps) {
    console.log({ name, email, password, password_confirm });

    try {
      console.log("Making request to create user...");
      const response = await api.post("/users", {
        name,
        email,
        password,
      });

      console.log("Response:", response);

      if (response.status > 201) {
        return show({
          title: response.data.message,
          placement: "top",
          bg: "red.500",
          duration: 3000,
        });
      }

      console.log("User created successfully!");
      show({
        title: "User created successfully!",
        placement: "top",
        bg: "green.500",
        duration: 3000,
      });

      new Promise(() =>
        setTimeout(() => {
          navigation.navigate("SignIn");
        }, 1000)
      );
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

          <Button title="Create" onPress={handleSubmit(handleCreateAccount)} />
        </Center>

        <Button
          variant={"outline"}
          title="Back to login"
          mt={10}
          onPress={handleNavigationToSignIn}
        />
      </VStack>
    </ScrollView>
  );
}
