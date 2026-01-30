import { ObjectType, Field, Float } from '@nestjs/graphql';
import { TransactionTypeGraphQL } from './transaction.type';

@ObjectType()
export class BalanceSummary {
  @Field(() => Float)
  currentBalance: number;

  @Field(() => Float)
  totalCredits: number;

  @Field(() => Float)
  totalDebits: number;

  @Field(() => [TransactionTypeGraphQL])
  transactions: TransactionTypeGraphQL[];
}
