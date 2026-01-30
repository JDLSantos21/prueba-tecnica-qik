import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionTypeGraphQL } from '../types/transaction.type';
import { CreateTransactionUseCase } from 'src/usecases/transaction/create-transaction.usecase';
import { CreateTransactionInput } from '../inputs/create-transaction.input';
import { PaginatedTransactions } from '../types/paginated-transactions.type';
import { GetTransactionsInput } from '../inputs/get-transactions.input';
import { GetTransactionsUseCase } from 'src/usecases/transaction/get-transactions.usecase';
import { TransferUseCase } from 'src/usecases/transaction/transfer.usecase';
import { TransferInput } from '../inputs/transfer.input';
import { TransferResult } from '../types/transfer-result.type';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';

@Resolver(() => TransactionTypeGraphQL)
@UseGuards(JwtAuthGuard)
export class TransactionResolver {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly transferUseCase: TransferUseCase,
  ) {}

  @Mutation(() => TransactionTypeGraphQL)
  async createTransaction(@Args('input') input: CreateTransactionInput) {
    const { accountId, amount, type, description } = input;
    return this.createTransactionUseCase.execute(
      accountId,
      amount,
      type,
      description,
    );
  }

  @Query(() => PaginatedTransactions, { name: 'transactions' })
  async getTransactions(@Args('input') input: GetTransactionsInput) {
    return this.getTransactionsUseCase.execute(input);
  }

  @Mutation(() => TransferResult)
  async transfer(@Args('input') input: TransferInput) {
    return this.transferUseCase.execute(
      input.fromAccountId,
      input.toAccountId,
      input.amount,
      input.description,
    );
  }
}
