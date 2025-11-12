import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('autobox_modules')
export class AutoboxModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // Ej: "AutoBox Centro", "AutoBox Providencia"

  @Column({ length: 200 })
  location: string; // Ubicación general

  @Column({ length: 300 })
  address: string; // Dirección completa

  @Column({ length: 50 })
  region: string; // Región de Chile

  @Column({ length: 100, nullable: true })
  gasStationName: string; // Estación de servicio asociada

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number; // Coordenadas GPS

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'json', nullable: true })
  cameraInfo: {
    brand?: string;
    model?: string;
    serialNumber?: string;
  };

  @Column({ type: 'json', nullable: true })
  networkInfo: {
    provider?: string;
    connectionType?: string;
    bandwidth?: string;
  };

  @Column({ length: 50, nullable: true })
  chipCompany: string; // Compañía del chip de datos

  @Column({ type: 'text', nullable: true })
  testCircuit: string; // Descripción del circuito de prueba

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 10 })
  capacity: number; // Inspecciones que puede manejar por día

  @Column({ type: 'json', nullable: true })
  workingHours: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
