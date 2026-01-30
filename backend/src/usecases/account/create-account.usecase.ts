import { Injectable } from '@nestjs/common';
import { AccountModel } from 'src/domain/models/account.model';
import { IAccountRepository } from 'src/domain/repositories/account.repository.interface';

@Injectable()
export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(ownerId: string): Promise<AccountModel> {
    const newAccount = new AccountModel();
    newAccount.ownerId = ownerId;
    newAccount.balance = 0;
    newAccount.accountNumber = this.generateAccountNumber();

    return this.accountRepository.create(newAccount);
  }

  private generateAccountNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
}
