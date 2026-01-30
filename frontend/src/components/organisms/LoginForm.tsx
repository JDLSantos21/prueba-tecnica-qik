import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../molecules/InputField";
import { Button, Text } from "../atoms";
import { useLogin } from "@/features/auth/hooks";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/schemas/auth.schemas";
import { colors } from "@/theme";

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const { login, loading, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {}
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            label="Usuario"
            placeholder="Ingresa tu usuario"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      {error && (
        <Text variant="error" style={styles.serverError}>
          {error.message}
        </Text>
      )}

      <Button
        title="Iniciar Sesión"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.button}
      />

      <Pressable onPress={onNavigateToRegister} style={styles.linkContainer}>
        <Text variant="body" style={styles.linkText}>
          ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    marginTop: 8,
  },
  serverError: {
    marginBottom: 12,
    textAlign: "center",
  },
  linkContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: colors.gray[500],
  },
  link: {
    color: colors.primary[500],
    fontWeight: "600",
  },
});
