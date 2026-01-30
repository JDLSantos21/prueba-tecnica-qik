import { AccountModel } from './account.model';

export class UserModel {
  id: string;
  name: string;
  lastName: string;
  username: string;
  password: string;
  accounts: AccountModel[];
}
