import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTransfer } from "./useTransactions";
import {
  useLookupAccount,
  useAccounts,
  AccountLookupResult,
} from "@/features/account/hooks/useAccount";
import {
  transferSchema,
  TransferFormData,
} from "../schemas/transaction.schemas";

type TransferMode = "select" | "manual";

interface UseTransferFormOptions {
  fromAccountId: string;
  onSuccess?: () => void;
}

export function useTransferForm({
  fromAccountId,
  onSuccess,
}: UseTransferFormOptions) {
  const router = useRouter();
  const [mode, setMode] = useState<TransferMode>("select");
  const [targetAccountId, setTargetAccountId] = useState<string | undefined>();
  const [lookupResult, setLookupResult] = useState<AccountLookupResult | null>(
    null,
  );

  const {
    transfer,
    loading: transferLoading,
    error: transferError,
  } = useTransfer(fromAccountId, targetAccountId);
  const { accounts } = useAccounts();
  const { lookup, loading: lookupLoading } = useLookupAccount();

  const availableAccounts = accounts.filter((acc) => acc.id !== fromAccountId);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      toAccountId: "",
      toAccountNumber: "",
      amount: "",
      description: "",
    },
  });

  const accountNumber = form.watch("toAccountNumber");

  const handleSelectAccount = useCallback(
    (account: { id: string }) => {
      form.setValue("toAccountId", account.id);
      form.setValue("toAccountNumber", "");
      setTargetAccountId(account.id);
      setLookupResult(null);
    },
    [form],
  );

  const handleLookupAccount = useCallback(async () => {
    if (!accountNumber || accountNumber.length < 10) {
      setLookupResult(null);
      setTargetAccountId(undefined);
      return;
    }

    const result = await lookup(accountNumber);
    setLookupResult(result);
    if (result) {
      setTargetAccountId(result.id);
      form.setValue("toAccountId", result.id);
    } else {
      setTargetAccountId(undefined);
      form.setValue("toAccountId", "");
    }
  }, [accountNumber, lookup, form]);

  const handleAccountNumberChange = useCallback(
    (text: string, onChange: (text: string) => void) => {
      onChange(text);
      setLookupResult(null);
      setTargetAccountId(undefined);
    },
    [],
  );

  const handleSubmit = form.handleSubmit(async (data: TransferFormData) => {
    try {
      const finalTargetAccountId = targetAccountId || data.toAccountId;

      if (mode === "manual" && !finalTargetAccountId) {
        Alert.alert("Error", "Cuenta no encontrada. Busca primero la cuenta.");
        return;
      }

      if (!finalTargetAccountId) {
        Alert.alert("Error", "Selecciona una cuenta destino");
        return;
      }

      await transfer({
        fromAccountId,
        toAccountId: finalTargetAccountId,
        amount: parseFloat(data.amount),
        description: data.description || undefined,
      });

      Alert.alert("Éxito", "Transferencia realizada correctamente", [
        { text: "OK", onPress: () => onSuccess?.() || router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "No se pudo realizar la transferencia",
      );
    }
  });

  return {
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
    isLoading: transferLoading,
    error: transferError,
  };
}
