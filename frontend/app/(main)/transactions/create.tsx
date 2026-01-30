import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Button } from "@/components/atoms";
import { InputField } from "@/components/molecules";
import { Ionicons } from "@expo/vector-icons";
import { useCreateTransaction } from "@/features/transactions/hooks/useTransactions";
import {
  createTransactionSchema,
  CreateTransactionFormData,
} from "@/features/transactions/schemas/transaction.schemas";

export default function CreateTransactionModal() {
  const { accountId, type } = useLocalSearchParams<{
    accountId: string;
    type: "CREDIT" | "DEBIT";
  }>();
  const router = useRouter();
  const { createTransaction, loading, error } = useCreateTransaction(
    accountId!,
  );

  const isCredit = type === "CREDIT";
  const title = isCredit ? "Registrar Crédito" : "Registrar Débito";
  const icon = isCredit ? "arrow-down-circle" : "arrow-up-circle";
  const color = isCredit ? "#22c55e" : "#ef4444";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      await createTransaction({
        accountId: accountId!,
        amount: parseFloat(data.amount),
        type: type!,
        description: data.description || undefined,
      });
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo registrar la transacción");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          title,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={48} color={color} />
          </View>
          <Text variant="subheading" style={styles.subtitle}>
            {isCredit
              ? "Ingresa el monto a depositar"
              : "Ingresa el monto a debitar"}
          </Text>
        </View>

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Monto"
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={errors.amount?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Descripción (opcional)"
              placeholder="Ej: Pago de servicio"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
            />
          )}
        />

        {error && (
          <Text variant="error" style={styles.errorText}>
            {error.message}
          </Text>
        )}

        <Button
          title={title}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={[styles.submitButton, { backgroundColor: color }]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#6b7280",
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});
