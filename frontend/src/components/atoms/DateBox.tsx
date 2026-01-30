import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "./Text";
import { colors } from "@/theme";

interface DateBoxProps {
  label: string;
  value: string | undefined;
  placeholder?: string;
  isActive?: boolean;
  onPress: () => void;
  formatValue?: (value: string) => string;
}

export const DateBox = memo(function DateBox({
  label,
  value,
  placeholder = "Seleccionar",
  isActive = false,
  onPress,
  formatValue,
}: DateBoxProps) {
  const displayValue = value
    ? formatValue
      ? formatValue(value)
      : value
    : placeholder;

  return (
    <Pressable
      style={[styles.container, isActive && styles.containerActive]}
      onPress={onPress}
    >
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
      <Text style={[styles.value, !value && styles.placeholder]}>
        {displayValue}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.gray[50],
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  containerActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  label: {
    color: colors.gray[500],
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray[900],
  },
  placeholder: {
    color: colors.gray[400],
    fontWeight: "400",
  },
});
