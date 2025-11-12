import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createMechanicDto: CreateMechanicDto): Promise<Mechanic> {
    const mechanic = this.mechanicRepository.create(createMechanicDto);
    return this.mechanicRepository.save(mechanic);
  }

  async findAll(): Promise<Mechanic[]> {
    return this.mechanicRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Mechanic[]> {
    return this.mechanicRepository.find({
      where: { isActive: true },
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({
      where: { id },
    });

    if (!mechanic) {
      throw new NotFoundException(`Mecánico con ID ${id} no encontrado`);
    }

    return mechanic;
  }

  async findByRut(rut: string): Promise<Mechanic | null> {
    return this.mechanicRepository.findOne({
      where: { rut },
    });
  }

  async findByEmail(email: string): Promise<Mechanic | null> {
    return this.mechanicRepository.findOne({
      where: { email },
    });
  }

  async update(
    id: string,
    updateMechanicDto: UpdateMechanicDto,
  ): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    Object.assign(mechanic, updateMechanicDto);
    return this.mechanicRepository.save(mechanic);
  }

  async remove(id: string): Promise<void> {
    const mechanic = await this.findOne(id);
    await this.mechanicRepository.remove(mechanic);
  }

  async incrementInspectionCount(id: string): Promise<void> {
    await this.mechanicRepository.increment({ id }, 'totalInspections', 1);
  }

  async updateRating(id: string, newRating: number): Promise<void> {
    await this.mechanicRepository.update(id, { rating: newRating });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAvailableForModule(_moduleId: string): Promise<Mechanic[]> {
    // TODO: Implementar lógica para encontrar mecánicos disponibles para un módulo específico
    // Por ahora retorna todos los mecánicos activos
    return this.findActive();
  }

  async getStatistics(id: string): Promise<{
    totalInspections: number;
    rating: number;
    activeModules: number;
  }> {
    const mechanic = await this.findOne(id);
    
    return {
      totalInspections: mechanic.totalInspections,
      rating: Number(mechanic.rating),
      activeModules: 0, // TODO: Calcular desde mechanic_modules
    };
  }
}
