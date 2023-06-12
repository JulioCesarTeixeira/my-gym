import { createContext, useEffect, useState } from "react";
import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";
import { getUser, removeUser, saveUser } from "@storage/storageUser";
import { SignInDTO, SignUpDTO } from "@dtos/AuthDTO";

export type AuthContextProps = {
  user: UserDTO | null;
  onSignIn: (data: SignInDTO) => Promise<any>;
  onSignUp: (data: Omit<SignUpDTO, "password_confirm">) => Promise<any>;
  onSignOut: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function onSignIn({ email, password }: SignInDTO) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      if (response.status > 201) {
        throw new Error(response.data.message);
      }

      saveUser(response.data.user);
      setUser(response.data.user);

      return response;
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
      await removeUser();
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
        setIsLoading(true);
        const user = await getUser();

        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ onSignIn, onSignUp, user, onSignOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}