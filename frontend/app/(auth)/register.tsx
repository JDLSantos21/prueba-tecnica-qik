import { useRouter } from "expo-router";
import { AuthTemplate } from "@/components/templates";
import { SignupForm } from "@/components/organisms";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <AuthTemplate
      title="Crear Cuenta"
      subtitle="Completa tus datos para registrarte"
    >
      <SignupForm onNavigateToLogin={() => router.back()} />
    </AuthTemplate>
  );
}
