import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoboxModulesService } from './autobox-modules.service';
import { AutoboxModulesController } from './autobox-modules.controller';
import { AutoboxModule } from './entities/autobox-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AutoboxModule])],
  controllers: [AutoboxModulesController],
  providers: [AutoboxModulesService],
  exports: [AutoboxModulesService],
})
export class AutoboxModulesModule {}
