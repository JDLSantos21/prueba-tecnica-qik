import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Text } from "@/components/atoms";
import { Ionicons } from "@expo/vector-icons";

import { usePaginatedTransactions } from "@/features/transactions/hooks/useTransactions";
import { useTransactionFilters } from "@/features/transactions/hooks/useTransactionFilters";

import { TypeFilterChips } from "@/features/transactions/components/TypeFilterChips";
import { DateFilterButton } from "@/features/transactions/components/DateFilterButton";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";

import { Transaction } from "@/features/transactions/types/transaction.types";

export default function TransactionsScreen() {
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const router = useRouter();

  const {
    filters,
    hasDateFilter,
    setTypeFilter,
    setStartDate,
    setEndDate,
    clearDates,
  } = useTransactionFilters();

  const { transactions, total, loading, hasNextPage, loadMore, refresh } =
    usePaginatedTransactions({
      accountId: accountId!,
      type: filters.type,
      startDate: filters.startDate,
      endDate: filters.endDate,
      pageSize: 15,
    });

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !loading) {
      loadMore();
    }
  }, [hasNextPage, loading, loadMore]);

  const handleDateApply = useCallback(
    (start: string | undefined, end: string | undefined) => {
      setStartDate(start);
      setEndDate(end);
    },
    [setStartDate, setEndDate],
  );

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => <TransactionListItem item={item} />,
    [],
  );

  const renderFooter = useCallback(() => {
    if (!loading || transactions.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text variant="caption" style={styles.footerText}>
          Cargando más...
        </Text>
      </View>
    );
  }, [loading, transactions.length]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
        <Text variant="body" style={styles.emptyText}>
          No hay transacciones
        </Text>
        <Text variant="caption" style={styles.emptySubtext}>
          {filters.type || hasDateFilter
            ? "Prueba cambiando los filtros"
            : "Aún no tienes movimientos"}
        </Text>
      </View>
    );
  }, [loading, filters.type, hasDateFilter]);

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Transacciones",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.back}>
              <Ionicons name="close" size={24} color="#1a1a1a" />
            </Pressable>
          ),
        }}
      />

      <View style={styles.filters}>
        <TypeFilterChips
          selected={filters.type || "ALL"}
          onSelect={setTypeFilter}
        />
        <DateFilterButton
          startDate={filters.startDate}
          endDate={filters.endDate}
          onApply={handleDateApply}
          onClear={clearDates}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text variant="caption" style={styles.resultsCount}>
          {total} transacción{total !== 1 ? "es" : ""}
        </Text>
      </View>

      {loading && transactions.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshing={loading && transactions.length > 0}
          onRefresh={refresh}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  back: {
    padding: 8,
  },
  filters: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    color: "#6b7280",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    color: "#6b7280",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: "#6b7280",
  },
  emptySubtext: {
    marginTop: 4,
    color: "#9ca3af",
    textAlign: "center",
  },
});
