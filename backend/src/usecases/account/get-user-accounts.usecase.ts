import { Injectable } from '@nestjs/common';
import { AccountModel } from 'src/domain/models/account.model';
import { IAccountRepository } from 'src/domain/repositories/account.repository.interface';

@Injectable()
export class GetUserAccountsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(userId: string): Promise<AccountModel[]> {
    return await this.accountRepository.findByOwner(userId);
  }
}
