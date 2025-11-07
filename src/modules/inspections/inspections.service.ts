import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from './entities/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepository: Repository<Inspection>,
  ) {}

  async create(createInspectionDto: CreateInspectionDto): Promise<Inspection> {
    const inspectionNumber = this.generateInspectionNumber();
    const inspection = this.inspectionRepository.create({
      ...createInspectionDto,
      inspectionNumber,
    });
    return this.inspectionRepository.save(inspection);
  }

  async findAll(): Promise<Inspection[]> {
    return this.inspectionRepository.find({ relations: ['vehicle', 'user'] });
  }

  async findOne(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
      relations: ['vehicle', 'user'],
    });
    if (!inspection) {
      throw new NotFoundException(`Inspección con ID ${id} no encontrada`);
    }
    return inspection;
  }

  async findByUser(userId: string): Promise<Inspection[]> {
    return this.inspectionRepository.find({
      where: { userId },
      relations: ['vehicle'],
    });
  }

  async findByVehicle(vehicleId: string): Promise<Inspection[]> {
    return this.inspectionRepository.find({
      where: { vehicleId },
      relations: ['user'],
    });
  }

  async update(
    id: string,
    updateInspectionDto: UpdateInspectionDto,
  ): Promise<Inspection> {
    const inspection = await this.findOne(id);
    Object.assign(inspection, updateInspectionDto);
    return this.inspectionRepository.save(inspection);
  }

  async remove(id: string): Promise<void> {
    const inspection = await this.findOne(id);
    await this.inspectionRepository.remove(inspection);
  }

  private generateInspectionNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');
    return `INS-${year}-${random}`;
  }
}
