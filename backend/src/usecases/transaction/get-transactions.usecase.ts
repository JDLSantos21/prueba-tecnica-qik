import { Injectable, Inject } from '@nestjs/common';
import {
  ITransactionRepository,
  TransactionFilters,
  PaginatedResult,
} from '../../domain/repositories/transaction.repository.interface';
import { TransactionModel } from '../../domain/models/transaction.model';

function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function toEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

@Injectable()
export class GetTransactionsUseCase {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    filters: TransactionFilters,
  ): Promise<PaginatedResult<TransactionModel>> {
    const normalizedFilters: TransactionFilters = {
      ...filters,
      startDate: filters.startDate
        ? toStartOfDay(new Date(filters.startDate))
        : undefined,
      endDate: filters.endDate
        ? toEndOfDay(new Date(filters.endDate))
        : undefined,
    };

    return await this.transactionRepository.findAll(normalizedFilters);
  }
}
