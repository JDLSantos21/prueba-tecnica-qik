import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { IAccountRepository } from '../../../domain/repositories/account.repository.interface';
import { AccountModel } from '../../../domain/models/account.model';
import { AccountEntity } from '../entities/account.entity';
import { AccountMapper } from '../mappers/account.mapper';

@Injectable()
export class AccountRepositoryImpl implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly typeOrmRepo: Repository<AccountEntity>,
    private readonly mapper: AccountMapper,
  ) {}

  async create(account: AccountModel): Promise<AccountModel> {
    try {
      const entity = this.mapper.toEntity(account);
      const saved = await this.typeOrmRepo.save(entity);
      return this.mapper.toModel(saved);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError.code === '23505')
          throw new ConflictException(
            'Account with this accountNumber already exists.',
          );
      }

      throw new InternalServerErrorException('Error creating account');
    }
  }

  async findById(id: string): Promise<AccountModel | null> {
    const entity = await this.typeOrmRepo.findOneBy({ id });
    return entity ? this.mapper.toModel(entity) : null;
  }

  async findByOwner(ownerId: string): Promise<AccountModel[]> {
    const entities = await this.typeOrmRepo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  async findByAccountNumber(
    accountNumber: string,
  ): Promise<AccountModel | null> {
    const entity = await this.typeOrmRepo.findOneBy({ accountNumber });
    return entity ? this.mapper.toModel(entity) : null;
  }
}
