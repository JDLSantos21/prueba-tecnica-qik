import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransactionTypeGraphQL } from './transaction.type';

@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

@ObjectType()
export class PaginatedTransactions {
  @Field(() => [TransactionTypeGraphQL])
  data: TransactionTypeGraphQL[];

  @Field(() => Int)
  total: number;

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
