import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 12 })
  rut: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 500 })
  photoUrl: string;

  @Column({ type: 'json', nullable: true })
  certifications: string[]; // Certificaciones profesionales

  @Column({ default: false })
  backgroundCheck: boolean; // Verificación de antecedentes

  @Column({ length: 50, nullable: true })
  chipNumber: string; // Número de chip asignado

  @Column({ length: 50, nullable: true })
  cameraNumber: string; // Cámara asignada para grabaciones

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number; // Calificación promedio 1.0 - 5.0

  @Column({ default: 0 })
  totalInspections: number; // Contador de inspecciones realizadas

  @Column({ type: 'text', nullable: true })
  notes: string; // Notas administrativas

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
