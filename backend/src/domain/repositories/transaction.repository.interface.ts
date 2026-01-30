import { TransactionModel, TransactionType } from '../models/transaction.model';

export interface TransactionFilters {
  accountId: string;
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  limit: number;
  offset: number;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  pageInfo: PageInfo;
}

export interface TransferResult {
  success: boolean;
  message: string;
  debitTransaction: TransactionModel;
  creditTransaction: TransactionModel;
}

export abstract class ITransactionRepository {
  abstract createTransaction(
    accountId: string,
    amount: number,
    type: TransactionType,
    description?: string,
  ): Promise<TransactionModel>;

  abstract findByAccount(accountId: string): Promise<TransactionModel[]>;

  abstract findAll(
    filters: TransactionFilters,
  ): Promise<PaginatedResult<TransactionModel>>;

  abstract getBalanceStats(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ totalCredits: number; totalDebits: number }>;

  abstract transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string,
  ): Promise<TransferResult>;
}
