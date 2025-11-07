import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [VehiclesModule],
  controllers: [SearchController],
})
export class SearchModule {}
