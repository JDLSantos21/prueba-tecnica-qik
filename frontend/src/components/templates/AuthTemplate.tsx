import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "../atoms";
import { colors } from "@/theme";

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthTemplate({ title, subtitle, children }: AuthTemplateProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="heading" style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="body" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
    color: colors.gray[900],
  },
  subtitle: {
    textAlign: "center",
    color: colors.gray[500],
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
});
