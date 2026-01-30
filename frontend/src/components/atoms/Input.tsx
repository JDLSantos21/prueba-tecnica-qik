import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { colors } from "@/theme";

interface InputProps extends TextInputProps {
  hasError?: boolean;
}

export function Input({ hasError, style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, hasError && styles.inputError, style]}
      placeholderTextColor={colors.gray[400]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger[600],
  },
});
