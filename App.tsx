import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { NativeBaseProvider } from "native-base";
import { Loading } from "@components/Loading";
import { THEME } from "./src/theme";
import { Routes } from "@routes/index";
import { AuthProvider } from "@contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={THEME}>
        <StatusBar style="light" translucent />
        <AuthProvider>{fontsLoaded ? <Routes /> : <Loading />}</AuthProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
}
