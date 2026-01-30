import { AccountModel } from '../models/account.model';

export abstract class IAccountRepository {
  abstract create(account: AccountModel): Promise<AccountModel>;
  abstract findByOwner(ownerId: string): Promise<AccountModel[]>;
  abstract findById(id: string): Promise<AccountModel | null>;
  abstract findByAccountNumber(
    accountNumber: string,
  ): Promise<AccountModel | null>;
}
