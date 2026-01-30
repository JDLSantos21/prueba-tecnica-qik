import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TransactionType } from 'src/domain/models/transaction.model';

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType({
  description: 'Represents a financial transaction (credit or debit).',
})
export class TransactionTypeGraphQL {
  @Field(() => ID, { description: 'Unique identifier of the transaction.' })
  id: string;

  @Field(() => Float, { description: 'Amount of the transaction.' })
  amount: number;

  @Field(() => TransactionType, {
    description: 'Type of transaction: CREDIT or DEBIT.',
  })
  type: TransactionType;

  @Field({ description: 'ID of the account associated with this transaction.' })
  accountId: string;

  @Field({
    nullable: true,
    description: 'Optional description or note for the transaction.',
  })
  description?: string;

  @Field({ description: 'Timestamp when the transaction occurred.' })
  createdAt: Date;
}
