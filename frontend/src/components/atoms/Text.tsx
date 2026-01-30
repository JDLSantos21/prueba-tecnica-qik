import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { colors } from "@/theme";

type TextVariant = "heading" | "subheading" | "body" | "caption" | "error";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children: React.ReactNode;
}

export function Text({
  variant = "body",
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.gray[900],
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    color: colors.gray[500],
  },
  error: {
    fontSize: 14,
    color: colors.danger[600],
  },
});
