import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Text } from "./Text";
import { colors } from "@/theme";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      {message && (
        <Text variant="caption" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[50],
  },
  message: {
    marginTop: 12,
    color: colors.gray[500],
  },
});
