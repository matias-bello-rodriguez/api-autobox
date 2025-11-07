import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10, unique: true })
  plate: string;

  @Column({ length: 100 })
  brand: string;

  @Column({ length: 100 })
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  kilometers: number;

  @Column({ length: 50 })
  fuelType: string;

  @Column({ length: 50 })
  transmission: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ default: 'available' }) // available, sold, inspection_pending
  status: string;

  @Column({ default: false })
  hasInspection: boolean;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
