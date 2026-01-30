import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LoginUseCase } from '../../../usecases/auth/login.usecase';
import { SignUpUseCase } from '../../../usecases/auth/signup.usecase';
import { AuthPayload } from '../types/auth.type';
import { LoginInput } from '../inputs/login.input';
import { SignUpInput } from '../inputs/signup.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly signUpUseCase: SignUpUseCase,
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.loginUseCase.execute(input.username, input.password);
  }

  @Mutation(() => AuthPayload)
  async signup(@Args('input') input: SignUpInput) {
    return this.signUpUseCase.execute(
      input.name,
      input.lastName,
      input.username,
      input.password,
    );
  }
}
