import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicEarningsService } from './mechanic-earnings.service';
import { MechanicEarningsController } from './mechanic-earnings.controller';
import { MechanicEarning } from './entities/mechanic-earning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MechanicEarning])],
  controllers: [MechanicEarningsController],
  providers: [MechanicEarningsService],
  exports: [MechanicEarningsService],
})
export class MechanicEarningsModule {}
