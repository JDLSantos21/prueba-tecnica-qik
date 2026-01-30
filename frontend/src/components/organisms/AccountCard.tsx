import React, { memo } from "react";
import { View, Pressable, StyleSheet, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../atoms";
import { colors } from "@/theme";

interface AccountCardProps extends Omit<PressableProps, "children"> {
  accountNumber: string;
  balance: number;
}

export const AccountCard = memo(function AccountCard({
  accountNumber,
  balance,
  style,
  ...props
}: AccountCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style as object,
      ]}
      {...props}
    >
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={24} color={colors.primary[500]} />
        <Text variant="caption" style={styles.accountNumber}>
          •••• {accountNumber.slice(-4)}
        </Text>
      </View>
      <Text variant="heading" style={styles.balance}>
        ${balance.toFixed(2)}
      </Text>
      <Text variant="caption" style={styles.label}>
        Balance disponible
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  accountNumber: {
    color: colors.gray[500],
  },
  balance: {
    fontSize: 32,
    marginBottom: 4,
  },
  label: {
    color: colors.gray[500],
  },
});
