import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './modules/account.module';
import { TransactionModule } from './modules/transaction.module';
import { AuthModule } from './modules/auth.module';
import { RedisModule } from './infrastructure/cache/redis.module';

import { AccountEntity } from './infrastructure/persistence/entities/account.entity';
import { TransactionEntity } from './infrastructure/persistence/entities/transaction.entity';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      entities: [AccountEntity, TransactionEntity, UserEntity],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    RedisModule,
    AuthModule,
    AccountModule,
    TransactionModule,
  ],
})
export class AppModule {}
