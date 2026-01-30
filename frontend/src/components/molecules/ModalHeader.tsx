import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

interface ModalHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  subtitle: string;
}

export function ModalHeader({
  icon,
  iconColor = colors.primary[500],
  iconBgColor,
  subtitle,
}: ModalHeaderProps) {
  const bgColor = iconBgColor || `${iconColor}20`;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={40} color={iconColor} />
      </View>
      <Text variant="subheading" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.gray[500],
    textAlign: "center",
  },
});
