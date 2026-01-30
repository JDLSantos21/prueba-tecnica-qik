export type TransactionType = "CREDIT" | "DEBIT";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  description: string | null;
  createdAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  pageInfo: PageInfo;
}

export interface BalanceSummary {
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: Transaction[];
}

export interface TransferResult {
  success: boolean;
  message: string;
  debitTransaction: Transaction;
  creditTransaction: Transaction;
}

export interface GetTransactionsInput {
  accountId: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionInput {
  accountId: string;
  amount: number;
  type: TransactionType;
  description?: string;
}

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export interface GetTransactionsResult {
  transactions: PaginatedTransactions;
}

export interface GetStatementResult {
  statement: BalanceSummary;
}
