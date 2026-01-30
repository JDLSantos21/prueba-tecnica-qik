import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => AccountEntity, (account) => account.ownerId)
  accounts: AccountEntity[];
}
