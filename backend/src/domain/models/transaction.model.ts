export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export class TransactionModel {
  id: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  description?: string;
  createdAt: Date;
}
