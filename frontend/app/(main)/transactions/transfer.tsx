import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Controller } from "react-hook-form";
import { Text, Button } from "@/components/atoms";
import {
  InputField,
  ModalHeader,
  TransferModeToggle,
} from "@/components/molecules";
import { AccountLookupInput } from "@/components/organisms/AccountLookupInput";
import { AccountSelector } from "@/features/account/components/AccountSelector";
import { useTransferForm } from "@/features/transactions/hooks/useTransferForm";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function TransferModal() {
  const { fromAccountId } = useLocalSearchParams<{ fromAccountId: string }>();
  const router = useRouter();

  const {
    form,
    mode,
    setMode,
    availableAccounts,
    targetAccountId,
    lookupResult,
    lookupLoading,
    accountNumber,
    handleSelectAccount,
    handleLookupAccount,
    handleAccountNumberChange,
    handleSubmit,
    isLoading,
    error,
  } = useTransferForm({ fromAccountId: fromAccountId! });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Transferir",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </Pressable>
          ),
        }}
      />

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bottomOffset={25}
      >
        <ModalHeader
          icon="swap-horizontal"
          iconColor="#3b82f6"
          iconBgColor="#dbeafe"
          subtitle="Transfiere a otra cuenta"
        />

        <TransferModeToggle mode={mode} onModeChange={setMode} />

        {mode === "select" ? (
          <>
            <AccountSelector
              accounts={availableAccounts}
              selectedId={targetAccountId}
              onSelect={handleSelectAccount}
            />
            {form.formState.errors.toAccountId && (
              <Text variant="error">
                {form.formState.errors.toAccountId.message}
              </Text>
            )}
          </>
        ) : (
          <AccountLookupInput
            control={form.control}
            accountNumber={accountNumber || ""}
            lookupResult={lookupResult}
            lookupLoading={lookupLoading}
            error={form.formState.errors.toAccountNumber?.message}
            onLookup={handleLookupAccount}
            onAccountNumberChange={handleAccountNumberChange}
          />
        )}

        <Controller
          control={form.control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Monto a Transferir"
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={form.formState.errors.amount?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Descripción (opcional)"
              placeholder="Ej: Pago de renta"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        {error && (
          <Text variant="error" style={styles.errorText}>
            {error.message}
          </Text>
        )}

        <Button title="Transferir" onPress={handleSubmit} loading={isLoading} />
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  closeButton: { padding: 8 },
  content: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  errorText: { textAlign: "center", marginBottom: 16 },
});
