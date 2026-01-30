import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { LOGIN_MUTATION } from "../api/auth.operations";
import { tokenService } from "../services/token.service";
import { useAuthStore } from "../store/auth.store";
import { AuthPayload, LoginInput } from "../types/auth.types";

interface LoginResult {
  login: AuthPayload;
}

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [loginMutation, { loading, error }] =
    useMutation<LoginResult>(LOGIN_MUTATION);

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        await tokenService.saveToken(data.login.accessToken);
        setUser(data.login.user);
        router.replace("/(main)/accounts");
      }
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  return {
    login,
    loading,
    error,
  };
}
