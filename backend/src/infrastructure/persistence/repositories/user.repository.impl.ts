import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserModel } from '../../../domain/models/user.model';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl extends IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userMapper: UserMapper,
  ) {
    super();
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    const entity = await this.userRepository.findOne({ where: { username } });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<UserModel | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async create(user: UserModel): Promise<UserModel> {
    const entity = this.userMapper.toEntity(user);
    const savedEntity = await this.userRepository.save(entity);
    return this.userMapper.toDomain(savedEntity);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { username } });
    return count > 0;
  }
}
