import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('Account', {
  description: 'Represents a bank account with balance and ownership info.',
})
export class AccountType {
  @Field(() => ID, { description: 'Unique identifier of the account.' })
  id: string;

  @Field({ description: 'The unique account number.' })
  accountNumber: string;

  @Field({ description: 'ID of the user who owns this account.' })
  ownerId: string;

  @Field(() => Float, { description: 'Current available balance.' })
  balance: number;

  @Field({ description: 'Timestamp when the account was created.' })
  createdAt: Date;

  @Field({ description: 'Timestamp when the account was last updated.' })
  updatedAt: Date;
}
