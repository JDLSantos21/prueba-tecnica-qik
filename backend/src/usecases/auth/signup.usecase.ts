import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserModel } from '../../domain/models/user.model';
import { JwtPayload } from '../../infrastructure/auth/types/jwt-payload.type';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    name: string,
    lastName: string,
    username: string,
    password: string,
  ) {
    const exists = await this.userRepository.existsByUsername(username);
    if (exists) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel();
    newUser.name = name;
    newUser.lastName = lastName;
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.accounts = [];

    const createdUser = await this.userRepository.create(newUser);

    const payload: JwtPayload = {
      sub: createdUser.id,
      username: createdUser.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: createdUser.id, username: createdUser.username },
    };
  }
}
