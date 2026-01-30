import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { colors } from "@/theme";

interface TransferModeToggleProps {
  mode: "select" | "manual";
  onModeChange: (mode: "select" | "manual") => void;
}

export function TransferModeToggle({
  mode,
  onModeChange,
}: TransferModeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, mode === "select" && styles.buttonActive]}
        onPress={() => onModeChange("select")}
      >
        <Text style={mode === "select" ? styles.textActive : styles.text}>
          Mis Cuentas
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, mode === "manual" && styles.buttonActive]}
        onPress={() => onModeChange("manual")}
      >
        <Text style={mode === "manual" ? styles.textActive : styles.text}>
          Número de Cuenta
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    padding: 3,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: colors.white,
  },
  text: {
    color: colors.gray[500],
    fontSize: 14,
    fontWeight: "500",
  },
  textActive: {
    color: colors.gray[900],
    fontSize: 14,
    fontWeight: "600",
  },
});
