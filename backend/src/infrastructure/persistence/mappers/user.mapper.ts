import { Injectable } from '@nestjs/common';
import { UserModel } from '../../../domain/models/user.model';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserMapper {
  toDomain(entity: UserEntity): UserModel {
    const model = new UserModel();
    model.id = entity.id;
    model.name = entity.name;
    model.lastName = entity.lastName;
    model.username = entity.username;
    model.password = entity.password;
    model.accounts = [];
    return model;
  }

  toEntity(model: UserModel): UserEntity {
    const entity = new UserEntity();
    if (model.id) {
      entity.id = model.id;
    }
    entity.name = model.name;
    entity.lastName = model.lastName;
    entity.username = model.username;
    entity.password = model.password;
    return entity;
  }
}
