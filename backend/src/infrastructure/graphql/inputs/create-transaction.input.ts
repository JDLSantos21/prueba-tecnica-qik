import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { TransactionType } from 'src/domain/models/transaction.model';

@InputType({
  description:
    'Input data to create a new transaction (Deposit or Withdrawal).',
})
export class CreateTransactionInput {
  @Field({ description: 'ID of the account performing the transaction.' })
  @IsUUID()
  accountId: string;

  @Field(() => Float, { description: 'Amount to transmit. Must be positive.' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Field(() => TransactionType, {
    description: 'Type of transaction: CREDIT (Deposit) or DEBIT (Withdrawal).',
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field({
    nullable: true,
    description: 'Optional note describing the transaction.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
