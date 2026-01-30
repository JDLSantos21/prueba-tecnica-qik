import { Resolver, Args, Mutation, Query, Int } from '@nestjs/graphql';
import { CreateAccountUseCase } from '../../../usecases/account/create-account.usecase';
import { AccountType } from '../types/account.type';
import { AccountLookupType } from '../types/account-lookup.type';
import { AccountModel } from '../../../domain/models/account.model';
import { GetAccountStatementUseCase } from 'src/usecases/account/get-account-statement.usecase';
import { GetUserAccountsUseCase } from 'src/usecases/account/get-user-accounts.usecase';
import { GetAccountDetailUseCase } from 'src/usecases/account/get-account-detail.usecase';
import { LookupAccountByNumberUseCase } from 'src/usecases/account/lookup-account-by-number.usecase';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';
import { BalanceSummary } from '../types/balance-summary.type';

@Resolver(() => AccountType)
@UseGuards(JwtAuthGuard)
export class AccountResolver {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountStatementUseCase: GetAccountStatementUseCase,
    private readonly getUserAccountsUseCase: GetUserAccountsUseCase,
    private readonly getAccountDetailUseCase: GetAccountDetailUseCase,
    private readonly lookupAccountByNumberUseCase: LookupAccountByNumberUseCase,
  ) {}

  @Query(() => String)
  hello(): string {
    return 'El servidor GraphQL está funcionando correctamente';
  }

  @Query(() => [AccountType], { name: 'accounts' })
  async getAccounts(
    @CurrentUser() user: { sub: string; username: string },
  ): Promise<AccountType[]> {
    const accounts = await this.getUserAccountsUseCase.execute(user.sub);
    return accounts.map((account) => this.toType(account));
  }

  @Query(() => AccountType, { name: 'account' })
  async getAccount(@Args('id') id: string): Promise<AccountType> {
    const account = await this.getAccountDetailUseCase.execute(id);
    return this.toType(account);
  }

  @Query(() => AccountLookupType, { name: 'lookupAccount', nullable: true })
  async lookupAccountByNumber(
    @Args('accountNumber') accountNumber: string,
  ): Promise<AccountLookupType | null> {
    return this.lookupAccountByNumberUseCase.execute(accountNumber);
  }

  @Mutation(() => AccountType)
  async createAccount(
    @CurrentUser() user: { sub: string; username: string },
  ): Promise<AccountType> {
    const account = await this.createAccountUseCase.execute(user.sub);
    return this.toType(account);
  }

  @Query(() => BalanceSummary, { name: 'statement' })
  async getStatement(
    @Args('accountId') accountId: string,
    @Args('month', { type: () => Int, nullable: true }) month?: number,
    @Args('year', { type: () => Int, nullable: true }) year?: number,
  ) {
    return this.getAccountStatementUseCase.execute(accountId, month, year);
  }

  private toType(model: AccountModel): AccountType {
    const type = new AccountType();
    type.id = model.id;
    type.accountNumber = model.accountNumber;
    type.ownerId = model.ownerId;
    type.balance = model.balance;
    type.createdAt = model.createdAt;
    type.updatedAt = model.updatedAt;
    return type;
  }
}
