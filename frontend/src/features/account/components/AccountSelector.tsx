import React, { useState, useCallback, memo } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

interface Account {
  id: string;
  accountNumber: string;
  balance: number;
}

interface AccountSelectorProps {
  accounts: Account[];
  selectedId: string | undefined;
  onSelect: (account: Account) => void;
}

export const AccountSelector = memo(function AccountSelector({
  accounts,
  selectedId,
  onSelect,
}: AccountSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!selectedId);
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  const handleSelect = useCallback(
    (account: Account) => {
      onSelect(account);
      setIsExpanded(false);
    },
    [onSelect],
  );

  if (selectedAccount && !isExpanded) {
    return (
      <View style={styles.container}>
        <Text variant="caption" style={styles.label}>
          Cuenta destino
        </Text>
        <Pressable
          style={styles.selectedCard}
          onPress={() => setIsExpanded(true)}
        >
          <View style={styles.selectedInfo}>
            <Ionicons
              name="wallet-outline"
              size={20}
              color={colors.primary[500]}
            />
            <View style={styles.selectedText}>
              <Text variant="body" style={styles.accountNumber}>
                •••• {selectedAccount.accountNumber.slice(-4)}
              </Text>
              <Text variant="caption" style={styles.balance}>
                ${selectedAccount.balance.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.changeButton}>
            <Text style={styles.changeText}>Cambiar</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.primary[500]}
            />
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.label}>
        Selecciona la cuenta destino
      </Text>
      {accounts.length === 0 ? (
        <Text variant="body" style={styles.noAccounts}>
          No tienes otras cuentas disponibles
        </Text>
      ) : (
        accounts.map((account) => (
          <Pressable
            key={account.id}
            style={[
              styles.accountOption,
              selectedId === account.id && styles.accountOptionSelected,
            ]}
            onPress={() => handleSelect(account)}
          >
            <View style={styles.accountInfo}>
              <Text variant="body" style={styles.optionNumber}>
                •••• {account.accountNumber.slice(-4)}
              </Text>
              <Text variant="caption" style={styles.optionBalance}>
                ${account.balance.toFixed(2)} disponible
              </Text>
            </View>
            {selectedId === account.id && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.primary[500]}
              />
            )}
          </Pressable>
        ))
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: colors.gray[700],
    fontWeight: "500",
  },
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary[50],
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedText: {
    gap: 2,
  },
  accountNumber: {
    fontWeight: "600",
    color: colors.primary[800],
  },
  balance: {
    color: colors.primary[500],
  },
  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    color: colors.primary[500],
    fontSize: 13,
    fontWeight: "500",
  },
  noAccounts: {
    textAlign: "center",
    color: colors.gray[500],
    paddingVertical: 20,
  },
  accountOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  accountOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.gray[50],
  },
  accountInfo: {
    flex: 1,
  },
  optionNumber: {
    fontWeight: "500",
  },
  optionBalance: {
    marginTop: 2,
    color: colors.gray[500],
  },
});
