import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mechanic } from '../../mechanics/entities/mechanic.entity';
import { Inspection } from '../../inspections/entities/inspection.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('mechanic_earnings')
export class MechanicEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mechanicId: string;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanicId' })
  mechanic: Mechanic;

  @Column({ type: 'uuid' })
  inspectionId: string;

  @ManyToOne(() => Inspection)
  @JoinColumn({ name: 'inspectionId' })
  inspection: Inspection;

  @Column({ type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number; // Precio total de la inspección

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number; // Porcentaje de comisión (ej: 70.00)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  earnedAmount: number; // Lo que gana el mecánico

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  platformFee: number; // Comisión de la plataforma

  @Column({ length: 30, default: 'pending' })
  status: string; // pending, approved, paid, withdrawn

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
