import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { AccountModel } from 'src/domain/models/account.model';
import { IAccountRepository } from 'src/domain/repositories/account.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class GetAccountDetailUseCase {
  constructor(
    @Inject(IAccountRepository)
    private readonly accountRepository: IAccountRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(id: string): Promise<AccountModel> {
    const cacheKey = `account_detail:${id}`;
    const cached = await this.cacheManager.get<AccountModel>(cacheKey);

    if (cached) {
      return cached;
    }

    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException('Account not found');

    await this.cacheManager.set(cacheKey, account, 60000);

    return account;
  }
}
