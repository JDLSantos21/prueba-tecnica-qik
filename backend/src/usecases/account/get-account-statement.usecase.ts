import { Injectable, NotFoundException } from '@nestjs/common';
import { BalanceSummaryModel } from 'src/domain/models/balance-summary.model';
import { IAccountRepository } from 'src/domain/repositories/account.repository.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository.interface';

@Injectable()
export class GetAccountStatementUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(
    accountId: string,
    month?: number,
    year?: number,
  ): Promise<BalanceSummaryModel> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) throw new NotFoundException('Account not found');

    const { startDate, endDate } = this.calculateCutOffDates(month, year);

    const stats = await this.transactionRepository.getBalanceStats(
      accountId,
      startDate,
      endDate,
    );

    const transactionsResult = await this.transactionRepository.findAll({
      accountId,
      startDate,
      endDate,
      limit: 100,
      offset: 0,
    });

    return {
      currentBalance: account.balance,
      totalCredits: stats.totalCredits,
      totalDebits: stats.totalDebits,
      transactions: transactionsResult.data,
    };
  }

  private calculateCutOffDates(
    month?: number,
    year?: number,
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month ? month - 1 : now.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);

    let endDate: Date;

    const isCurrentMonth =
      targetMonth === now.getMonth() && targetYear === now.getFullYear();

    if (isCurrentMonth) {
      endDate = now;
    } else {
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    }

    return { startDate, endDate };
  }
}
