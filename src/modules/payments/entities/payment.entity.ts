import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inspection } from '../../inspections/entities/inspection.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  inspectionId: string;

  @ManyToOne(() => Inspection)
  @JoinColumn({ name: 'inspectionId' })
  inspection: Inspection;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50, default: 'pending' }) // pending, completed, failed
  status: string;

  @Column({ length: 50 })
  paymentMethod: string;

  @Column({ length: 100, nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
