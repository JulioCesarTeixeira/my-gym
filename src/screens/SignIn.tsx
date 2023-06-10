import { VStack, Text, Image, Center, Heading, ScrollView, useToast } from "native-base";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { api } from "@services/api";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required." }).nonempty(),
  password: z.string({ required_error: "Password is required." }).nonempty(),
})

type FormDataProps = z.infer<typeof LoginSchema>;

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {control, handleSubmit} = useForm<FormDataProps>({
    resolver: zodResolver(LoginSchema),
  })
  const { show } = useToast();

  function handleNavigationToSignUp() {
    navigation.navigate("SignUp");
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      console.log("Authenticating user...");
      const response = await api.post(
        "/sessions",
        {
          email,
          password,
        },
      );

      console.log("Response:", response.data);

      if (response.status > 201) {
        return show({
          title: response.data.message,
          placement: "top",
          bg: "red.500",
          duration: 3000,
        });
      }

      show({
        title: "User succesfully authenticated!",
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
      if(error.response.data.message) {
        return show({
          title: error.response.data.message,
          placement: "top",
          bg: "red.500",
          duration: 3000,
        });
      } 
      return show({
        title: "Something went wrong. Please, try again.",
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
                />
              </>
            )}
          />
          <Button title="Sign in" onPress={handleSubmit(handleSignIn)} />
        </Center>

        <Center mt={24} style={{ gap: 12 }}>
          <Text color={"white"} fontSize={"sm"}>
            Don't have an account?
          </Text>
          <Button
            variant={"outline"}
            title="Create an account"
            onPress={handleNavigationToSignUp}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
