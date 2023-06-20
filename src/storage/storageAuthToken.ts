import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

type AuthToken = {
  token: string;
  refresh_token: string;
};

export async function saveAuthToken({ token, refresh_token }: AuthToken) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refresh_token })
  );
}

export async function getAuthToken() {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

  const { refresh_token, token }: AuthToken = response
    ? JSON.parse(response)
    : {};

  return { refresh_token, token };
}

export async function removeAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
