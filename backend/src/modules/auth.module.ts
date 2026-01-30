import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IUserRepository } from '../domain/repositories/user.repository.interface';

import { UserEntity } from '../infrastructure/persistence/entities/user.entity';
import { UserRepositoryImpl } from '../infrastructure/persistence/repositories/user.repository.impl';
import { UserMapper } from '../infrastructure/persistence/mappers/user.mapper';

import { JwtStrategy } from '../infrastructure/auth/strategies/jwt.strategy';

import { AuthResolver } from '../infrastructure/graphql/resolvers/auth.resolver';

import { LoginUseCase } from '../usecases/auth/login.usecase';
import { SignUpUseCase } from '../usecases/auth/signup.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,

    LoginUseCase,
    SignUpUseCase,

    JwtStrategy,

    UserMapper,
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [JwtStrategy, PassportModule, IUserRepository],
})
export class AuthModule {}
