export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
  },

  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
  },

  danger: {
    50: "#fef2f2",
    500: "#ef4444",
    600: "#dc2626",
  },

  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

export const semanticColors = {
  background: colors.gray[50],
  surface: colors.white,
  textPrimary: colors.gray[900],
  textSecondary: colors.gray[500],
  textMuted: colors.gray[400],
  border: colors.gray[200],
  borderFocus: colors.primary[500],
  error: colors.danger[500],
  errorBackground: colors.danger[50],
} as const;

export type ColorKey = keyof typeof colors;
