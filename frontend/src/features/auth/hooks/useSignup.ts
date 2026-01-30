import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { SIGNUP_MUTATION } from "../api/auth.operations";
import { tokenService } from "../services/token.service";
import { useAuthStore } from "../store/auth.store";
import { AuthPayload, SignUpInput } from "../types/auth.types";

interface SignupResult {
  signup: AuthPayload;
}

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [signupMutation, { loading, error }] =
    useMutation<SignupResult>(SIGNUP_MUTATION);

  const signup = async (input: SignUpInput) => {
    try {
      const { data } = await signupMutation({
        variables: { input },
      });

      if (data?.signup) {
        await tokenService.saveToken(data.signup.accessToken);
        setUser(data.signup.user);
        router.replace("/(main)/accounts");
      }
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
