import { useAccount } from "./useAccount";
import {
  useStatement,
  useTransactions,
} from "@/features/transactions/hooks/useTransactions";

export interface AccountDetailData {
  account: ReturnType<typeof useAccount>["account"];
  statement: ReturnType<typeof useStatement>["statement"];
  recentTransactions: ReturnType<typeof useTransactions>["transactions"];
  isLoading: boolean;
  error: Error | null;
}

export function useAccountDetail(accountId: string): AccountDetailData {
  const {
    account,
    loading: accountLoading,
    error: accountError,
  } = useAccount(accountId);
  const { statement, loading: statementLoading } = useStatement(accountId);
  const { transactions: recentTransactions, loading: transactionsLoading } =
    useTransactions({
      accountId,
      limit: 10,
      offset: 0,
    });

  const isLoading = accountLoading || statementLoading || transactionsLoading;

  return {
    account,
    statement,
    recentTransactions,
    isLoading,
    error: accountError || null,
  };
}
