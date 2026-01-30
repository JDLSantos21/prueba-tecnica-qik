import { useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Text, Button } from "@/components/atoms";
import { AccountCard } from "@/components/organisms";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import {
  useAccounts,
  useCreateAccount,
} from "@/features/account/hooks/useAccount";
import { Account } from "@/features/auth/types/account.types";
import { colors } from "@/theme";

export default function AccountsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const { accounts } = useAccounts();
  const { createAccount, loading: createAccountLoading } = useCreateAccount();

  const handleAccountPress = useCallback(
    (id: string) => {
      router.push(`/(main)/accounts/${id}`);
    },
    [router],
  );

  const renderAccount = useCallback(
    ({ item }: { item: Account }) => (
      <AccountCard
        accountNumber={item.accountNumber}
        balance={item.balance}
        onPress={() => handleAccountPress(item.id)}
      />
    ),
    [handleAccountPress],
  );

  const keyExtractor = useCallback((item: Account) => item.id, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={logout} style={styles.logoutButton}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={colors.danger[500]}
              />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={accounts}
        keyExtractor={keyExtractor}
        renderItem={renderAccount}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Button
            title="Crear Nueva Cuenta"
            variant="outline"
            onPress={() => {
              createAccount();
            }}
            disabled={createAccountLoading}
            loading={createAccountLoading}
            style={styles.createButton}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="wallet-outline"
              size={48}
              color={colors.gray[400]}
            />
            <Text variant="body" style={styles.emptyText}>
              No tienes cuentas aún
            </Text>
            <Text variant="caption" style={styles.emptySubtext}>
              Crea tu primera cuenta para empezar
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  logoutButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  createButton: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: colors.gray[500],
  },
  emptySubtext: {
    marginTop: 4,
    color: colors.gray[400],
  },
});
