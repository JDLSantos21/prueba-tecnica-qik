import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "../types/transaction.types";

interface TransactionListItemProps {
  item: Transaction;
}

export const TransactionListItem = memo(function TransactionListItem({
  item,
}: TransactionListItemProps) {
  const isCredit = item.type === "CREDIT";
  const color = isCredit ? "#22c55e" : "#ef4444";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons
          name={isCredit ? "arrow-down" : "arrow-up"}
          size={20}
          color={color}
        />
      </View>
      <View style={styles.info}>
        <Text variant="body" style={styles.description}>
          {item.description || (isCredit ? "Crédito" : "Débito")}
        </Text>
        <Text variant="caption">{formatDate(item.createdAt)}</Text>
      </View>
      <Text variant="body" style={[styles.amount, { color }]}>
        {isCredit ? "+" : "-"}${item.amount.toFixed(2)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  description: {
    fontWeight: "500",
  },
  amount: {
    fontWeight: "600",
  },
});
