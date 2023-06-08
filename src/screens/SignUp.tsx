import { VStack, Text, Image, Center, Heading, ScrollView } from "native-base";
import { z } from "zod";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }).nonempty(),
    email: z
      .string({ required_error: "Email is required."})
      .nonempty("Email is required.")
      .email({ message: "Email is invalid." }),
    password: z
      .string({ required_error: "Password is required."})
      .nonempty("Password is required.")
      .min(6, { message: "Password must have at least 6 characters." }),
    password_confirm: z
      .string({ required_error: "Please, confirm your password."})
      .nonempty("Please, confirm your password.")
      .min(6),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords must match.",
    path: ["password_confirm"],
  })


type FormDataProps = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm<FormDataProps>({
    reValidateMode: "onChange",
    resolver: zodResolver(signUpSchema),
  });

  function handleNavigationToSignIn() {
    navigation.goBack();
  }

  function handleCreateAccount({
    name,
    email,
    password,
    password_confirm,
  }: FormDataProps) {
    console.log({ name, email, password, password_confirm });
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

          {/* <Input placeholder="Confirm password" secureTextEntry /> */}
          <Button title="Create" onPress={handleSubmit(handleCreateAccount)} />
        </Center>

        <Center mt={24} style={{ gap: 12 }}>
          <Button
            variant={"outline"}
            title="Back to login"
            onPress={handleNavigationToSignIn}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
