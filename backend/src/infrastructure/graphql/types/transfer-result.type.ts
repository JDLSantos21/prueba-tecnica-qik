import { ObjectType, Field } from '@nestjs/graphql';
import { TransactionTypeGraphQL } from './transaction.type';

@ObjectType()
export class TransferResult {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => TransactionTypeGraphQL)
  debitTransaction: TransactionTypeGraphQL;

  @Field(() => TransactionTypeGraphQL)
  creditTransaction: TransactionTypeGraphQL;
}
