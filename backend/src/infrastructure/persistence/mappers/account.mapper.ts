import { Injectable } from '@nestjs/common';
import { AccountModel } from '../../../domain/models/account.model';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class AccountMapper {
  toModel(entity: AccountEntity): AccountModel {
    const model = new AccountModel();
    model.id = entity.id;
    model.accountNumber = entity.accountNumber;
    model.ownerId = entity.ownerId;
    model.balance = Number(entity.balance);
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }

  toEntity(model: AccountModel): AccountEntity {
    const entity = new AccountEntity();
    entity.id = model.id;
    entity.accountNumber = model.accountNumber;
    entity.ownerId = model.ownerId;
    entity.balance = model.balance;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}
