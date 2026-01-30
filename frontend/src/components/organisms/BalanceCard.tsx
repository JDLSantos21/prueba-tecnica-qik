import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

interface BalanceCardProps {
  balance: number;
  totalCredits: number;
  totalDebits: number;
}

export function BalanceCard({
  balance,
  totalCredits,
  totalDebits,
}: BalanceCardProps) {
  return (
    <View style={styles.card}>
      <Text variant="caption" style={styles.label}>
        Balance Disponible
      </Text>
      <Text variant="heading" style={styles.amount}>
        ${balance.toFixed(2)}
      </Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons
            name="arrow-down-circle"
            size={16}
            color={colors.success[500]}
          />
          <Text variant="caption" style={styles.statText}>
            Créditos: ${totalCredits.toFixed(2)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="arrow-up-circle"
            size={16}
            color={colors.danger[500]}
          />
          <Text variant="caption" style={styles.statText}>
            Débitos: ${totalDebits.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary[800],
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    textAlign: "center",
  },
  amount: {
    color: colors.white,
    fontSize: 36,
    marginBottom: 16,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});
