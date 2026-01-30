import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITransactionRepository } from 'src/domain/repositories/transaction.repository.interface';
import { TransactionResolver } from 'src/infrastructure/graphql/resolvers/transaction.resolver';
import { AccountEntity } from 'src/infrastructure/persistence/entities/account.entity';
import { TransactionEntity } from 'src/infrastructure/persistence/entities/transaction.entity';
import { TransactionMapper } from 'src/infrastructure/persistence/mappers/transaction.mapper';
import { TransactionRepositoryImpl } from 'src/infrastructure/persistence/repositories/transaction.repository.impl';
import { CreateTransactionUseCase } from 'src/usecases/transaction/create-transaction.usecase';
import { GetTransactionsUseCase } from 'src/usecases/transaction/get-transactions.usecase';
import { TransferUseCase } from 'src/usecases/transaction/transfer.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, AccountEntity])],
  providers: [
    TransactionResolver,
    CreateTransactionUseCase,
    GetTransactionsUseCase,
    TransferUseCase,
    TransactionMapper,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
  ],
  exports: [ITransactionRepository],
})
export class TransactionModule {}
