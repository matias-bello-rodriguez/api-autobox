import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class VehiclesService {
  private readonly GETAPI_URL = 'https://chile.getapi.cl/v1/vehicles/plate';
  private readonly GETAPI_KEY = 'keyTestLimited'; // Cambiar por tu API key real

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly uploadsService: UploadsService,
  ) {}

  /**
   * Convierte las URLs de videos de S3 a URLs firmadas
   */
  private async convertVideoUrls(vehicles: Vehicle[]): Promise<Vehicle[]> {
    return Promise.all(
      vehicles.map(async (vehicle) => {
        // Convertir array de videos
        if (vehicle.videos && Array.isArray(vehicle.videos)) {
          vehicle.videos = await Promise.all(
            vehicle.videos.map(async (videoUrl) => {
              if (videoUrl && videoUrl.includes('s3.amazonaws.com')) {
                try {
                  return await this.uploadsService.getSignedUrlFromPublicUrl(videoUrl);
                } catch (error) {
                  console.error('Error convirtiendo URL de video:', error);
                  return videoUrl;
                }
              }
              return videoUrl;
            })
          );
        }
        return vehicle;
      }),
    );
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({ relations: ['owner'] });
    return this.convertVideoUrls(vehicles);
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    
    // Convertir array de videos a presigned URLs si existen
    if (vehicle.videos && Array.isArray(vehicle.videos)) {
      vehicle.videos = await Promise.all(
        vehicle.videos.map(async (videoUrl) => {
          if (videoUrl && videoUrl.includes('s3.amazonaws.com')) {
            try {
              return await this.uploadsService.getSignedUrlFromPublicUrl(videoUrl);
            } catch (error) {
              console.error('Error convirtiendo URL de video:', error);
              return videoUrl;
            }
          }
          return videoUrl;
        })
      );
    }
    
    return vehicle;
  }

  async findByOwner(ownerId: string): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({
      where: { ownerId },
    });
    return this.convertVideoUrls(vehicles);
  }

  async search(query: string): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .where('vehicle.brand LIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.model LIKE :query', { query: `%${query}%` })
      .orWhere('vehicle.description LIKE :query', { query: `%${query}%` })
      .getMany();
    
    return this.convertVideoUrls(vehicles);
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

  async getModelsByBrand(brand: string): Promise<string[]> {
    // Base de datos de modelos por marca (los más populares en Chile)
    const modelsByBrand: Record<string, string[]> = {
      'Toyota': ['Corolla', 'Yaris', 'RAV4', 'Hilux', 'Land Cruiser', 'Prius', 'Camry', 'CHR', 'Highlander', 'Fortuner'],
      'Chevrolet': ['Spark', 'Sail', 'Cruze', 'Tracker', 'Onix', 'Captiva', 'Trailblazer', 'Tahoe', 'Colorado', 'Camaro'],
      'Nissan': ['Versa', 'Sentra', 'Kicks', 'Qashqai', 'X-Trail', 'Frontier', 'Pathfinder', 'Leaf', 'Altima', 'March'],
      'Hyundai': ['Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'Venue', 'Palisade', 'Ioniq', 'i30'],
      'Mazda': ['2', '3', '6', 'CX-3', 'CX-5', 'CX-9', 'CX-30', 'MX-5', 'BT-50'],
      'Honda': ['Civic', 'City', 'Accord', 'CR-V', 'HR-V', 'Fit', 'Pilot', 'Odyssey', 'Ridgeline'],
      'Kia': ['Rio', 'Forte', 'Sportage', 'Sorento', 'Seltos', 'Soul', 'Stinger', 'Carnival', 'Picanto', 'Niro'],
      'Suzuki': ['Swift', 'Baleno', 'Vitara', 'S-Cross', 'Jimny', 'Ertiga', 'Ciaz', 'Alto', 'Ignis'],
    };

    const models = modelsByBrand[brand] || [];
    return models;
  }

  async getYearsByBrandAndModel(brand: string, model: string): Promise<number[]> {
    // Rangos de años por marca y modelo
    // En producción esto vendría de una base de datos o API externa
    const yearRanges: Record<string, Record<string, { start: number; end: number }>> = {
      'Toyota': {
        'Corolla': { start: 1990, end: 2025 },
        'Yaris': { start: 2005, end: 2025 },
        'RAV4': { start: 1995, end: 2025 },
        'Hilux': { start: 1990, end: 2025 },
        'Land Cruiser': { start: 1990, end: 2024 },
        'Prius': { start: 2001, end: 2025 },
        'Camry': { start: 1990, end: 2025 },
        'CHR': { start: 2016, end: 2025 },
        'Highlander': { start: 2001, end: 2025 },
        'Fortuner': { start: 2005, end: 2025 },
      },
      'Chevrolet': {
        'Spark': { start: 2005, end: 2022 },
        'Sail': { start: 2010, end: 2020 },
        'Cruze': { start: 2008, end: 2023 },
        'Tracker': { start: 2013, end: 2025 },
        'Onix': { start: 2012, end: 2025 },
        'Captiva': { start: 2006, end: 2025 },
        'Trailblazer': { start: 2012, end: 2025 },
        'Tahoe': { start: 1995, end: 2025 },
        'Colorado': { start: 2004, end: 2025 },
        'Camaro': { start: 2010, end: 2024 },
      },
      'Nissan': {
        'Versa': { start: 2006, end: 2025 },
        'Sentra': { start: 1990, end: 2025 },
        'Kicks': { start: 2016, end: 2025 },
        'Qashqai': { start: 2006, end: 2025 },
        'X-Trail': { start: 2001, end: 2025 },
        'Frontier': { start: 1998, end: 2025 },
        'Pathfinder': { start: 1990, end: 2025 },
        'Leaf': { start: 2010, end: 2025 },
        'Altima': { start: 1993, end: 2025 },
        'March': { start: 2010, end: 2021 },
      },
      'Hyundai': {
        'Accent': { start: 1995, end: 2025 },
        'Elantra': { start: 1990, end: 2025 },
        'Tucson': { start: 2004, end: 2025 },
        'Santa Fe': { start: 2001, end: 2025 },
        'Creta': { start: 2015, end: 2025 },
        'Kona': { start: 2017, end: 2025 },
        'Venue': { start: 2019, end: 2025 },
        'Palisade': { start: 2018, end: 2025 },
        'Ioniq': { start: 2016, end: 2025 },
        'i30': { start: 2007, end: 2025 },
      },
      'Mazda': {
        '2': { start: 2007, end: 2025 },
        '3': { start: 2003, end: 2025 },
        '6': { start: 2002, end: 2021 },
        'CX-3': { start: 2015, end: 2021 },
        'CX-5': { start: 2012, end: 2025 },
        'CX-9': { start: 2007, end: 2025 },
        'CX-30': { start: 2019, end: 2025 },
        'MX-5': { start: 1990, end: 2025 },
        'BT-50': { start: 2006, end: 2025 },
      },
      'Honda': {
        'Civic': { start: 1990, end: 2025 },
        'City': { start: 1996, end: 2025 },
        'Accord': { start: 1990, end: 2025 },
        'CR-V': { start: 1997, end: 2025 },
        'HR-V': { start: 2015, end: 2025 },
        'Fit': { start: 2001, end: 2020 },
        'Pilot': { start: 2003, end: 2025 },
        'Odyssey': { start: 1995, end: 2025 },
        'Ridgeline': { start: 2006, end: 2025 },
      },
      'Kia': {
        'Rio': { start: 2000, end: 2025 },
        'Forte': { start: 2008, end: 2025 },
        'Sportage': { start: 1993, end: 2025 },
        'Sorento': { start: 2002, end: 2025 },
        'Seltos': { start: 2019, end: 2025 },
        'Soul': { start: 2009, end: 2025 },
        'Stinger': { start: 2017, end: 2025 },
        'Carnival': { start: 2006, end: 2025 },
        'Picanto': { start: 2004, end: 2025 },
        'Niro': { start: 2016, end: 2025 },
      },
      'Suzuki': {
        'Swift': { start: 2005, end: 2025 },
        'Baleno': { start: 2015, end: 2025 },
        'Vitara': { start: 1988, end: 2025 },
        'S-Cross': { start: 2013, end: 2025 },
        'Jimny': { start: 1998, end: 2025 },
        'Ertiga': { start: 2012, end: 2025 },
        'Ciaz': { start: 2014, end: 2025 },
        'Alto': { start: 2000, end: 2025 },
        'Ignis': { start: 2016, end: 2025 },
      },
    };

    const brandData = yearRanges[brand];
    if (!brandData || !brandData[model]) {
      return [];
    }

    const { start, end } = brandData[model];
    const years: number[] = [];
    
    // Generar array de años en orden descendente (más reciente primero)
    for (let year = end; year >= start; year--) {
      years.push(year);
    }

    return years;
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
