import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  private readonly GETAPI_URL = 'https://chile.getapi.cl/v1/vehicles/plate';
  private readonly GETAPI_KEY = 'keyTestLimited'; // Cambiar por tu API key real

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ relations: ['owner'] });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    return vehicle;
  }

  async findByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ where: { ownerId } });
  }

  async search(query: string): Promise<Vehicle[]> {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.brand LIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.model LIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.description LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async validatePlate(plate: string): Promise<{ valid: boolean; vehicle?: any; message?: string }> {
    try {
      // Validar formato de patente chilena
      // Formatos válidos: AABB00 (nuevo) o BB0000 (antiguo)
      const plateRegex = /^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/;
      
      if (!plateRegex.test(plate.toUpperCase())) {
        return { 
          valid: false,
          message: 'Formato de patente inválido. Use AABB00 o BB0000',
        };
      }

      // Formato válido
      return {
        valid: true,
        vehicle: {
          plate: plate.toUpperCase(),
          format: 'valid',
        },
      };

    } catch (error) {
      console.error('Error al validar patente:', error);
      return { 
        valid: false,
        message: 'Error interno al validar patente'
      };
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }
}
