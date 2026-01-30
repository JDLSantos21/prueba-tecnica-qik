import { useRouter } from "expo-router";
import { AuthTemplate } from "@/components/templates";
import { LoginForm } from "@/components/organisms";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthTemplate title="Bienvenido" subtitle="Inicia sesión para continuar">
      <LoginForm onNavigateToRegister={() => router.push("/(auth)/register")} />
    </AuthTemplate>
  );
}
