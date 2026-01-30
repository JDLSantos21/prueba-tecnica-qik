import { Inject, Injectable } from '@nestjs/common';
import { TransactionType } from 'src/domain/models/transaction.model';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(
    accountId: string,
    amount: number,
    type: TransactionType,
    description?: string,
  ) {
    const transaction = await this.transactionRepository.createTransaction(
      accountId,
      amount,
      type,
      description,
    );

    await this.cacheManager.del(`account_detail:${accountId}`);

    return transaction;
  }
}
