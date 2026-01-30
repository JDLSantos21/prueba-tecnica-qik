import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Account ownerId must not be empty' })
  @IsUUID('4', { message: 'ownerId must be a valid UUID version 4' })
  ownerId: string;
}
