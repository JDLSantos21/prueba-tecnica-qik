import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_TRANSACTIONS_QUERY,
  GET_STATEMENT_QUERY,
  CREATE_TRANSACTION_MUTATION,
  TRANSFER_MUTATION,
} from "../api/transaction.operations";
import {
  GetTransactionsResult,
  GetTransactionsInput,
  GetStatementResult,
  CreateTransactionInput,
  TransferInput,
  Transaction,
  TransferResult,
} from "../types/transaction.types";
import { GET_ACCOUNTS_QUERY } from "@/features/account/account.operations";

const DEFAULT_PAGE_SIZE = 10;

interface UsePaginatedTransactionsOptions {
  accountId: string;
  type?: "CREDIT" | "DEBIT";
  startDate?: string;
  endDate?: string;
  pageSize?: number;
}

export function usePaginatedTransactions({
  accountId,
  type,
  startDate,
  endDate,
  pageSize = DEFAULT_PAGE_SIZE,
}: UsePaginatedTransactionsOptions) {
  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetTransactionsResult>(GET_TRANSACTIONS_QUERY, {
      variables: {
        input: {
          accountId,
          type,
          startDate,
          endDate,
          limit: pageSize,
          offset: 0,
        },
      },
      notifyOnNetworkStatusChange: true,
    });

  const transactions = data?.transactions.data || [];
  const total = data?.transactions.total || 0;
  const hasNextPage = data?.transactions.pageInfo?.hasNextPage ?? false;

  const loadMore = useCallback(() => {
    if (!hasNextPage || loading) return;

    fetchMore({
      variables: {
        input: {
          accountId,
          type,
          startDate,
          endDate,
          limit: pageSize,
          offset: transactions.length,
        },
      },
    });
  }, [
    accountId,
    type,
    startDate,
    endDate,
    pageSize,
    transactions.length,
    hasNextPage,
    loading,
    fetchMore,
  ]);

  const refresh = useCallback(() => {
    refetch({
      input: {
        accountId,
        type,
        startDate,
        endDate,
        limit: pageSize,
        offset: 0,
      },
    });
  }, [accountId, type, startDate, endDate, pageSize, refetch]);

  return {
    transactions,
    total,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
  };
}

export function useTransactions(input: GetTransactionsInput) {
  const { data, loading, error, refetch } = useQuery<GetTransactionsResult>(
    GET_TRANSACTIONS_QUERY,
    { variables: { input } },
  );

  return {
    transactions: data?.transactions.data || [],
    total: data?.transactions.total || 0,
    loading,
    error,
    refetch,
  };
}

export function useStatement(accountId: string, month?: number, year?: number) {
  const { data, loading, error, refetch } = useQuery<GetStatementResult>(
    GET_STATEMENT_QUERY,
    {
      variables: { accountId, month, year },
      skip: !accountId,
    },
  );

  return {
    statement: data?.statement,
    loading,
    error,
    refetch,
  };
}

export function useCreateTransaction(accountId: string) {
  const [createTransactionMutation, { loading, error }] = useMutation<{
    createTransaction: Transaction;
  }>(CREATE_TRANSACTION_MUTATION, {
    refetchQueries: [
      {
        query: GET_TRANSACTIONS_QUERY,
        variables: {
          input: { accountId, limit: DEFAULT_PAGE_SIZE, offset: 0 },
        },
      },
      { query: GET_STATEMENT_QUERY, variables: { accountId } },
      { query: GET_ACCOUNTS_QUERY },
    ],
    awaitRefetchQueries: true,
  });

  const createTransaction = async (input: CreateTransactionInput) => {
    const result = await createTransactionMutation({ variables: { input } });
    return result.data?.createTransaction;
  };

  return { createTransaction, loading, error };
}

export function useTransfer(fromAccountId: string, toAccountId?: string) {
  const [transferMutation, { loading, error }] = useMutation<{
    transfer: TransferResult;
  }>(TRANSFER_MUTATION, {
    refetchQueries: (result) => {
      const queries = [
        { query: GET_ACCOUNTS_QUERY },
        {
          query: GET_TRANSACTIONS_QUERY,
          variables: {
            input: {
              accountId: fromAccountId,
              limit: DEFAULT_PAGE_SIZE,
              offset: 0,
            },
          },
        },
        { query: GET_STATEMENT_QUERY, variables: { accountId: fromAccountId } },
      ];

      const targetAccountId =
        toAccountId || result.data?.transfer?.creditTransaction?.accountId;
      if (targetAccountId) {
        queries.push(
          {
            query: GET_TRANSACTIONS_QUERY,
            variables: {
              input: {
                accountId: targetAccountId,
                limit: DEFAULT_PAGE_SIZE,
                offset: 0,
              },
            },
          },
          {
            query: GET_STATEMENT_QUERY,
            variables: { accountId: targetAccountId },
          },
        );
      }

      return queries;
    },
    awaitRefetchQueries: true,
  });

  const transfer = async (input: TransferInput) => {
    const result = await transferMutation({ variables: { input } });
    return result.data?.transfer;
  };

  return { transfer, loading, error };
}
