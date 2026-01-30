import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { colors } from "@/theme";

interface MainTemplateProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: object;
}

export function MainTemplate({
  children,
  scrollable = true,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
}: MainTemplateProps) {
  if (!scrollable) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: 16,
  },
});
