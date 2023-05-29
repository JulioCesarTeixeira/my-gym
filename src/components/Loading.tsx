import { Center, Heading, Spinner } from "native-base";

export function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner accessibilityLabel="Loading posts" />
    </Center>
  );
}
