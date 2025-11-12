import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutoboxModule } from './entities/autobox-module.entity';
import { CreateAutoboxModuleDto } from './dto/create-autobox-module.dto';
import { UpdateAutoboxModuleDto } from './dto/update-autobox-module.dto';

@Injectable()
export class AutoboxModulesService {
  constructor(
    @InjectRepository(AutoboxModule)
    private readonly moduleRepository: Repository<AutoboxModule>,
  ) {}

  async create(
    createAutoboxModuleDto: CreateAutoboxModuleDto,
  ): Promise<AutoboxModule> {
    const module = this.moduleRepository.create(createAutoboxModuleDto);
    return this.moduleRepository.save(module);
  }

  async findAll(): Promise<AutoboxModule[]> {
    return this.moduleRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findActive(): Promise<AutoboxModule[]> {
    return this.moduleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByRegion(region: string): Promise<AutoboxModule[]> {
    return this.moduleRepository.find({
      where: { region, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AutoboxModule> {
    const module = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
    }

    return module;
  }

  async update(
    id: string,
    updateAutoboxModuleDto: UpdateAutoboxModuleDto,
  ): Promise<AutoboxModule> {
    const module = await this.findOne(id);
    Object.assign(module, updateAutoboxModuleDto);
    return this.moduleRepository.save(module);
  }

  async remove(id: string): Promise<void> {
    const module = await this.findOne(id);
    await this.moduleRepository.remove(module);
  }

  async getCapacityStatus(id: string): Promise<{
    totalCapacity: number;
    availableSlots: number;
    bookedToday: number;
  }> {
    const module = await this.findOne(id);

    // TODO: Calcular inspecciones reservadas para hoy
    const bookedToday = 0;

    return {
      totalCapacity: module.capacity,
      availableSlots: module.capacity - bookedToday,
      bookedToday,
    };
  }
}
