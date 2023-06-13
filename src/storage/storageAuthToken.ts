import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

export async function saveAuthToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, token);
}

export async function getAuthToken() {
  return await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);
}

export async function removeAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
