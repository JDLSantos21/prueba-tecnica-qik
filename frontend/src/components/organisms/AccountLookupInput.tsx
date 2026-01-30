import React from "react";
import { View, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import { Text } from "@/components/atoms";
import { InputField } from "@/components/molecules";
import { Ionicons } from "@expo/vector-icons";
import { AccountLookupResult } from "@/features/account/hooks/useAccount";
import { TransferFormData } from "@/features/transactions/schemas/transaction.schemas";
import { colors } from "@/theme";

interface AccountLookupInputProps {
  control: Control<TransferFormData>;
  accountNumber: string;
  lookupResult: AccountLookupResult | null;
  lookupLoading: boolean;
  error?: string;
  onLookup: () => void;
  onAccountNumberChange: (
    text: string,
    onChange: (text: string) => void,
  ) => void;
}

export function AccountLookupInput({
  control,
  accountNumber,
  lookupResult,
  lookupLoading,
  error,
  onLookup,
  onAccountNumberChange,
}: AccountLookupInputProps) {
  return (
    <View>
      <Controller
        control={control}
        name="toAccountNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.row}>
            <View style={styles.input}>
              <InputField
                label="Número de Cuenta"
                placeholder="Ingresa el número de cuenta"
                value={value}
                onChangeText={(text) => onAccountNumberChange(text, onChange)}
                onBlur={onBlur}
                keyboardType="number-pad"
                error={error}
              />
            </View>
            <Pressable
              style={styles.searchButton}
              onPress={onLookup}
              disabled={lookupLoading}
            >
              {lookupLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="search" size={20} color={colors.white} />
              )}
            </Pressable>
          </View>
        )}
      />

      {lookupResult && (
        <View style={styles.result}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.success[500]}
          />
          <View style={styles.resultText}>
            <Text variant="body" style={styles.ownerName}>
              {lookupResult.ownerName}
            </Text>
            <Text variant="caption" style={styles.accountNumberSmall}>
              ••••{lookupResult.accountNumber.slice(-4)}
            </Text>
          </View>
        </View>
      )}

      {lookupResult === null &&
        accountNumber &&
        accountNumber.length >= 10 &&
        !lookupLoading && (
          <View style={styles.notFound}>
            <Ionicons
              name="alert-circle"
              size={18}
              color={colors.danger[500]}
            />
            <Text variant="caption" style={styles.notFoundText}>
              Busca la cuenta para verificar el destinatario
            </Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: colors.primary[500],
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.success[50],
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  resultText: {
    flex: 1,
  },
  ownerName: {
    fontWeight: "600",
    color: "#166534",
  },
  accountNumberSmall: {
    color: colors.success[500],
  },
  notFound: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.danger[50],
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  notFoundText: {
    color: colors.danger[500],
  },
});
