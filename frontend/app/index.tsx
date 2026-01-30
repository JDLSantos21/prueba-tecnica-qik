import { Redirect } from "expo-router";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(main)/accounts" />;
  }

  return <Redirect href="/(auth)/login" />;
}
