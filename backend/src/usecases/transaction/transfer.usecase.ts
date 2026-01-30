import { Injectable, Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TransferResult,
} from '../../domain/repositories/transaction.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class TransferUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string,
  ): Promise<TransferResult> {
    const result = await this.transactionRepository.transfer(
      fromAccountId,
      toAccountId,
      amount,
      description,
    );

    await Promise.all([
      this.cacheManager.del(`account_detail:${fromAccountId}`),
      this.cacheManager.del(`account_detail:${toAccountId}`),
    ]);

    return result;
  }
}
