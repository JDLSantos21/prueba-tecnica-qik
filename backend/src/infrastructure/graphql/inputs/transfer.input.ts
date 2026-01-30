import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsUUID,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType({ description: 'Input data to transfer funds between accounts.' })
export class TransferInput {
  @Field({ description: 'ID of the source account.' })
  @IsUUID()
  fromAccountId: string;

  @Field({ description: 'ID of the destination account.' })
  @IsUUID()
  toAccountId: string;

  @Field(() => Float, { description: 'Amount to transfer. Must be positive.' })
  @IsNumber()
  @IsPositive({ message: 'El monto debe ser positivo' })
  amount: number;

  @Field({ nullable: true, description: 'Optional note for the transfer.' })
  @IsOptional()
  @IsString()
  description?: string;
}
