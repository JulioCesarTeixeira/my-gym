import { VStack, Text, Image, Center, Heading, ScrollView } from "native-base";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

export function SignUp() {
  const navigation = useNavigation();

  function handleNavigationToSignIn() {
    navigation.goBack();
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

          <Input mb={4} placeholder="Name" autoCorrect={false} />
          <Input
            mb={4}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input placeholder="Password" secureTextEntry mb={4} />
          {/* <Input placeholder="Confirm password" secureTextEntry mb={4} /> */}
          <Button title="Create" />
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