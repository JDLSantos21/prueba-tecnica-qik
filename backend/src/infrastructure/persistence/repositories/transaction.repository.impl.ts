import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ITransactionRepository,
  PaginatedResult,
  TransactionFilters,
  TransferResult,
} from 'src/domain/repositories/transaction.repository.interface';
import { DataSource } from 'typeorm';
import { TransactionMapper } from '../mappers/transaction.mapper';
import {
  TransactionType,
  TransactionModel,
} from 'src/domain/models/transaction.model';
import { AccountEntity } from '../entities/account.entity';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mapper: TransactionMapper,
  ) {}

  async createTransaction(
    accountId: string,
    amount: number,
    type: TransactionType,
    description?: string,
  ): Promise<TransactionModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await queryRunner.manager.findOne(AccountEntity, {
        where: { id: accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) throw new BadRequestException('Account not found');

      const currentBalance = Number(account.balance);
      const txAmount = Number(amount);

      if (type === TransactionType.DEBIT) {
        if (currentBalance < txAmount)
          throw new BadRequestException('Insufficient balance');
        account.balance = currentBalance - txAmount;
      } else {
        account.balance = currentBalance + txAmount;
      }

      await queryRunner.manager.save(account);

      const txEntity = queryRunner.manager.create(TransactionEntity, {
        accountId: account.id,
        amount: txAmount,
        type: type,
        description,
      });

      const savedTx = await queryRunner.manager.save(txEntity);

      await queryRunner.commitTransaction();

      return this.mapper.toModel(savedTx);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create transaction');
    } finally {
      await queryRunner.release();
    }
  }

  async findByAccount(accountId: string): Promise<TransactionModel[]> {
    return await this.dataSource
      .getRepository(TransactionEntity)
      .find({ where: { accountId } })
      .then((entities) => entities.map((e) => this.mapper.toModel(e)));
  }

  async findAll(
    filters: TransactionFilters,
  ): Promise<PaginatedResult<TransactionModel>> {
    const { accountId, type, startDate, endDate, limit, offset } = filters;

    const query = this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('tx')
      .where('tx.accountId = :accountId', { accountId });

    if (type) {
      query.andWhere(`tx.type = :type`, { type });
    }

    if (startDate) {
      query.andWhere(`tx.createdAt >= :startDate`, { startDate });
    }

    if (endDate) {
      query.andWhere(`tx.createdAt <= :endDate`, { endDate });
    }

    query.orderBy('tx.createdAt', 'DESC').skip(offset).take(limit);

    const [transactions, total] = await query.getManyAndCount();

    return {
      data: transactions.map((tx) => this.mapper.toModel(tx)),
      total,
      pageInfo: {
        hasNextPage: offset + transactions.length < total,
        hasPreviousPage: offset > 0,
      },
    };
  }

  async getBalanceStats(
    accountId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ totalCredits: number; totalDebits: number }> {
    const buildQuery = (type: TransactionType) => {
      const query = this.dataSource
        .getRepository(TransactionEntity)
        .createQueryBuilder('tx')
        .select('SUM(tx.amount)', 'total')
        .where('tx.accountId = :accountId', { accountId })
        .andWhere('tx.type = :type', { type });

      if (startDate)
        query.andWhere('tx.createdAt >= :startDate', { startDate });

      if (endDate) query.andWhere('tx.createdAt <= :endDate', { endDate });

      return query;
    };

    const creditsResult = await buildQuery(TransactionType.CREDIT).getRawOne<{
      total: string | null;
    }>();

    const debitsResult = await buildQuery(TransactionType.DEBIT).getRawOne<{
      total: string | null;
    }>();

    return {
      totalCredits: Number(creditsResult?.total ?? 0),
      totalDebits: Number(debitsResult?.total ?? 0),
    };
  }

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string,
  ): Promise<TransferResult> {
    if (fromAccountId === toAccountId) {
      throw new BadRequestException('No puedes transferir a la misma cuenta');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fromAccount = await queryRunner.manager.findOne(AccountEntity, {
        where: { id: fromAccountId },
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await queryRunner.manager.findOne(AccountEntity, {
        where: { id: toAccountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount) {
        throw new BadRequestException('Cuenta de origen no encontrada');
      }

      if (!toAccount) {
        throw new BadRequestException('Cuenta de destino no encontrada');
      }

      const currentBalance = Number(fromAccount.balance);
      const transferAmount = Number(amount);

      if (currentBalance < transferAmount) {
        throw new BadRequestException(
          'Saldo insuficiente para la transferencia',
        );
      }

      fromAccount.balance = currentBalance - transferAmount;
      toAccount.balance = Number(toAccount.balance) + transferAmount;

      await queryRunner.manager.save(fromAccount);
      await queryRunner.manager.save(toAccount);

      const debitDescription =
        description || `Transferencia a cuenta ${toAccount.accountNumber}`;
      const debitTx = queryRunner.manager.create(TransactionEntity, {
        accountId: fromAccountId,
        amount: transferAmount,
        type: TransactionType.DEBIT,
        description: debitDescription,
      });
      const savedDebitTx = await queryRunner.manager.save(debitTx);

      const creditDescription =
        description ||
        `Transferencia desde cuenta ${fromAccount.accountNumber}`;
      const creditTx = queryRunner.manager.create(TransactionEntity, {
        accountId: toAccountId,
        amount: transferAmount,
        type: TransactionType.CREDIT,
        description: creditDescription,
      });
      const savedCreditTx = await queryRunner.manager.save(creditTx);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: `Transferencia de ${transferAmount} realizada exitosamente`,
        debitTransaction: this.mapper.toModel(savedDebitTx),
        creditTransaction: this.mapper.toModel(savedCreditTx),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error al procesar la transferencia',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
