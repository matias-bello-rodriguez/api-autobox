import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mechanic } from '../../mechanics/entities/mechanic.entity';
import { AutoboxModule } from '../../autobox-modules/entities/autobox-module.entity';

@Entity('mechanic_modules')
export class MechanicModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  mechanicId: string;

  @ManyToOne(() => Mechanic)
  @JoinColumn({ name: 'mechanicId' })
  mechanic: Mechanic;

  @Column({ type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => AutoboxModule)
  @JoinColumn({ name: 'moduleId' })
  module: AutoboxModule;

  @Column({ type: 'date' })
  assignedDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
