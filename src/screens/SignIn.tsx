import { VStack, Text, Image, Center, Heading, ScrollView } from "native-base";

import BackgroundImage from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function SignIn() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg={"gray.700"} px={8}>
        <Image
          source={BackgroundImage}
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

          <Input
            mb={4}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input placeholder="Password" secureTextEntry mb={4} />
          <Button title="Sign in" />
        </Center>

        <Center mt={24} style={{ gap: 12 }}>
          <Text color={"white"} fontSize={"sm"}>
            Don't have an account?
          </Text>
          <Button variant={"outline"} title="Create an account" />
        </Center>
      </VStack>
    </ScrollView>
  );
}
