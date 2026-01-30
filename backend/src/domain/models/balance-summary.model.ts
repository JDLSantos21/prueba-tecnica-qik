import { TransactionModel } from './transaction.model';

export class BalanceSummaryModel {
  currentBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: TransactionModel[];
}
