import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IAccountRepository } from '../domain/repositories/account.repository.interface';

import { CreateAccountUseCase } from '../usecases/account/create-account.usecase';
import { GetAccountStatementUseCase } from 'src/usecases/account/get-account-statement.usecase';
import { GetUserAccountsUseCase } from 'src/usecases/account/get-user-accounts.usecase';
import { GetAccountDetailUseCase } from 'src/usecases/account/get-account-detail.usecase';
import { LookupAccountByNumberUseCase } from 'src/usecases/account/lookup-account-by-number.usecase';

import { AccountEntity } from '../infrastructure/persistence/entities/account.entity';
import { AccountRepositoryImpl } from '../infrastructure/persistence/repositories/account.repository.impl';
import { AccountMapper } from '../infrastructure/persistence/mappers/account.mapper';

import { AccountResolver } from '../infrastructure/graphql/resolvers/account.resolver';
import { TransactionModule } from './transaction.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    TransactionModule,
    AuthModule,
  ],
  providers: [
    AccountResolver,

    CreateAccountUseCase,
    GetAccountStatementUseCase,
    GetUserAccountsUseCase,
    GetAccountDetailUseCase,
    LookupAccountByNumberUseCase,

    AccountMapper,

    {
      provide: IAccountRepository,
      useClass: AccountRepositoryImpl,
    },
  ],
  exports: [CreateAccountUseCase],
})
export class AccountModule {}
