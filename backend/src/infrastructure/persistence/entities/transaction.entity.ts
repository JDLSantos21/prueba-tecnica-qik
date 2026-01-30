import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 14, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  type: 'credit' | 'debit';

  @Column('uuid')
  accountId: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @CreateDateColumn()
  createdAt: Date;
}
