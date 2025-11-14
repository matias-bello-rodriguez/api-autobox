import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.vehiclesService.search(query);
  }

  @Get('validate-plate/:plate')
  validatePlate(@Param('plate') plate: string) {
    return this.vehiclesService.validatePlate(plate);
  }

  @Get('models/:brand')
  getModelsByBrand(@Param('brand') brand: string) {
    return this.vehiclesService.getModelsByBrand(brand);
  }

  @Get('years/:brand/:model')
  getYearsByBrandAndModel(
    @Param('brand') brand: string,
    @Param('model') model: string,
  ) {
    return this.vehiclesService.getYearsByBrandAndModel(brand, model);
  }

  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.vehiclesService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
