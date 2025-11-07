import { Controller, Get, Query } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';

@Controller('search')
export class SearchController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.vehiclesService.search(query);
  }
}
