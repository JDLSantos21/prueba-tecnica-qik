import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Text, LoadingScreen, SectionHeader } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAccountDetail } from "@/features/account/hooks/useAccountDetail";
import { BalanceCard, QuickActions } from "@/components/organisms";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";
import { formatAccountNumber } from "@/utils/formatters";
import { Transaction } from "@/features/transactions/types/transaction.types";

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showFullNumber, setShowFullNumber] = useState(false);
  const router = useRouter();

  const { account, statement, recentTransactions, isLoading } =
    useAccountDetail(id!);

  const handleCredit = () =>
    router.push({
      pathname: "/(main)/transactions/create",
      params: { accountId: id, type: "CREDIT" },
    });

  const handleDebit = () =>
    router.push({
      pathname: "/(main)/transactions/create",
      params: { accountId: id, type: "DEBIT" },
    });

  const handleTransfer = () =>
    router.push({
      pathname: "/(main)/transactions/transfer",
      params: { fromAccountId: id },
    });

  const handleViewAll = () =>
    router.push({
      pathname: "/(main)/transactions",
      params: { accountId: id },
    });

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionListItem item={item} />
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Cuenta ${formatAccountNumber(account?.accountNumber || "", showFullNumber)}`,
          headerRight: () => (
            <Pressable
              onPress={() => setShowFullNumber(!showFullNumber)}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showFullNumber ? "eye-off" : "eye"}
                size={24}
                color="#3b82f6"
              />
            </Pressable>
          ),
        }}
      />

      <BalanceCard
        balance={statement?.currentBalance || account?.balance || 0}
        totalCredits={statement?.totalCredits || 0}
        totalDebits={statement?.totalDebits || 0}
      />

      <QuickActions
        onCredit={handleCredit}
        onDebit={handleDebit}
        onTransfer={handleTransfer}
      />

      <SectionHeader
        title="Actividad reciente"
        actionLabel="Ver todos"
        onAction={handleViewAll}
      />

      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text variant="body" style={styles.emptyText}>
            No hay transacciones aún
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  toggleButton: {
    height: "100%",
    width: 40,
    alignItems: "center",
    borderRadius: 999,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 24,
  },
});
