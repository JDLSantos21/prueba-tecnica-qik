import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@/components/atoms";

interface QuickActionsProps {
  onCredit: () => void;
  onDebit: () => void;
  onTransfer: () => void;
}

export function QuickActions({
  onCredit,
  onDebit,
  onTransfer,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Button
        title="Crédito"
        variant="success"
        icon="arrow-down-circle-outline"
        size="md"
        style={styles.button}
        onPress={onCredit}
      />
      <Button
        title="Débito"
        variant="danger"
        icon="arrow-up-circle-outline"
        size="md"
        style={styles.button}
        onPress={onDebit}
      />
      <Button
        title="Transferir"
        variant="primary"
        icon="swap-horizontal-outline"
        size="md"
        style={styles.button}
        onPress={onTransfer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
});
