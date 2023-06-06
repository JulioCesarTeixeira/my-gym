import { VStack, Text, Image, Center, Heading, ScrollView } from "native-base";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export function SignUp() {
  const navigation = useNavigation();

  const { control, formState, handleSubmit } = useForm<FormDataProps>();

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
            Create an account
          </Heading>

          <Controller
            control={control}
            name="name"
            rules={{
              required: {
                value: true,
                message: "Name is required",
              },
            }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  mb={4}
                  placeholder="Name"
                  autoCorrect={false}
                  onChangeText={onChange}
                  value={value}
                />
                {fieldState.error && (
                  <Text color={"red.500"}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: "E-mail is required",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  mb={4}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={onChange}
                  value={value}
                />
                {error && <Text color={"red.500"}>{error.message}</Text>}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: {
                value: true,
                message: "Password is required",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Password"
                  secureTextEntry
                  mb={4}
                  onChangeText={onChange}
                  value={value}
                />
                {error && <Text color={"red.500"}>{error.message}</Text>}
              </>
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            rules={{
              required: {
                value: true,
                message: "Password confirmation is required",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Input
                  placeholder="Confirm password"
                  secureTextEntry
                  mb={4}
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleCreateAccount)}
                  returnKeyType="send"
                />
                {error && <Text color={"red.500"}>{error.message}</Text>}
              </>
            )}
          />

          {/* <Input placeholder="Confirm password" secureTextEntry mb={4} /> */}
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
