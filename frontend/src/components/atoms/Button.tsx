import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "danger"
  | "ghost";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  size = "md",
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getTextColor = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return colors.primary[500];
      default:
        return colors.white;
    }
  };

  const iconColor = getTextColor();
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style as object,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              styles[`text_${size}`],
              { color: getTextColor() },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  size_md: {
    height: 44,
    paddingHorizontal: 16,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.gray[500],
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  success: {
    backgroundColor: colors.success[500],
  },
  danger: {
    backgroundColor: colors.danger[500],
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
  },
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
