import React from "react";
import { View, StyleSheet, TextInputProps } from "react-native";
import { Text } from "../atoms/Text";
import { Input } from "../atoms/Input";
import { colors } from "@/theme";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.label}>
        {label}
      </Text>
      <Input hasError={!!error} {...props} />
      {error && (
        <Text variant="error" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: "500",
    color: colors.gray[700],
  },
  error: {
    marginTop: 4,
  },
});
