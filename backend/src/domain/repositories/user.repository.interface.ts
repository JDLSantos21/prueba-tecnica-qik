import { UserModel } from '../models/user.model';

export abstract class IUserRepository {
  abstract findByUsername(username: string): Promise<UserModel | null>;
  abstract findById(id: string): Promise<UserModel | null>;
  abstract create(user: UserModel): Promise<UserModel>;
  abstract existsByUsername(username: string): Promise<boolean>;
}
