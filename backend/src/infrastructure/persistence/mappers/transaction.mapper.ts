import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../entities/transaction.entity';
import {
  TransactionModel,
  TransactionType,
} from '../../../domain/models/transaction.model';

@Injectable()
export class TransactionMapper {
  toModel(entity: TransactionEntity): TransactionModel {
    const model = new TransactionModel();
    model.id = entity.id;
    model.amount = Number(entity.amount);
    model.type = entity.type as TransactionType;
    model.accountId = entity.accountId;
    model.description = entity.description;
    model.createdAt = entity.createdAt;
    return model;
  }
}
