import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('AccountLookup')
export class AccountLookupType {
  @Field(() => ID)
  id: string;

  @Field()
  accountNumber: string;

  @Field()
  ownerName: string;
}
