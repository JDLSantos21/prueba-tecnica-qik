import { Injectable, Inject } from '@nestjs/common';
import { IAccountRepository } from '../../domain/repositories/account.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface AccountLookupResult {
  id: string;
  accountNumber: string;
  ownerName: string;
}

@Injectable()
export class LookupAccountByNumberUseCase {
  constructor(
    @Inject(IAccountRepository)
    private readonly accountRepository: IAccountRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(accountNumber: string): Promise<AccountLookupResult | null> {
    const cacheKey = `account_lookup:${accountNumber}`;
    const cached = await this.cacheManager.get<AccountLookupResult>(cacheKey);

    if (cached) {
      return cached;
    }

    const account =
      await this.accountRepository.findByAccountNumber(accountNumber);

    if (!account) {
      return null;
    }

    const owner = await this.userRepository.findById(account.ownerId);

    if (!owner) {
      return null;
    }

    const result = {
      id: account.id,
      accountNumber: account.accountNumber,
      ownerName: `${owner.name} ${owner.lastName}`,
    };

    await this.cacheManager.set(cacheKey, result, 3600000);

    return result;
  }
}
