import { createContext, useEffect, useState } from "react";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";
import { getUser, removeUser, saveUser } from "@storage/storageUser";
import { SignInDTO, SignUpDTO } from "@dtos/AuthDTO";
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
} from "@storage/storageAuthToken";

export type AuthContextProps = {
  user: UserDTO | null;
  onSignIn: (data: SignInDTO) => Promise<any>;
  onSignUp: (data: Omit<SignUpDTO, "password_confirm">) => Promise<any>;
  onSignOut: () => void;
  isLoading: boolean;
  updateUser(data: Partial<UserDTO>): Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

async function storageUpdateUserAndToken(user: UserDTO, token: string) {
  try {
    await saveUser(user);
    await saveAuthToken(token);
  } catch (error: any) {
    throw error;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function storageRemoveUserAndToken() {
    try {
      await removeUser();
      await removeAuthToken();
    } catch (error: any) {
      throw error;
    }
  }

  function userAndTokenUpdate(user: UserDTO, token: string) {
    try {
      // Attach token to all requests made to the API
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignIn({ email, password }: SignInDTO) {
    try {
      const { data } = await api.post("/sessions", {
        email,
        password,
      });

      if (data.user && data.token) {
        await storageUpdateUserAndToken(data.user, data.token);
        userAndTokenUpdate(data.user, data.token);
      }
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async function onSignUp({
    email,
    name,
    password,
  }: Omit<SignUpDTO, "password_confirm">) {
    try {
      const response = await api.post("/users", {
        email,
        name,
        password,
      });

      if (response.status > 201) {
        throw new Error(response.data.message);
      }

      await onSignIn({ email, password });
    } catch (error: any) {
      throw error;
    }
  }

  async function onSignOut() {
    console.log("Signing out...");
    try {
      setIsLoading(true);
      await storageRemoveUserAndToken();
      setUser(null);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getUser();
        const token = await getAuthToken();

        if (user && token) {
          userAndTokenUpdate(user, token);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function updateUserProfile(data: Partial<UserDTO>) {
    try {
      const updatedUser: UserDTO | null = user ? { ...user, ...data } : null;
      if (!updatedUser) {
        return;
      }

      setUser(updatedUser);
      await saveUser(updatedUser);
    } catch (error: any) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        onSignIn,
        onSignUp,
        user,
        onSignOut,
        isLoading,
        updateUser: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
