export interface Account {
  id: string;
  accountNumber: string;
  ownerId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAccountsResult {
  accounts: Account[];
}

export interface GetAccountResult {
  account: Account;
}
