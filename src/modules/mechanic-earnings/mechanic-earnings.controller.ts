import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MechanicEarningsService } from './mechanic-earnings.service';
import { CreateMechanicEarningDto } from './dto/create-mechanic-earning.dto';

@Controller('mechanic-earnings')
export class MechanicEarningsController {
  constructor(
    private readonly mechanicEarningsService: MechanicEarningsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMechanicEarningDto: CreateMechanicEarningDto) {
    return this.mechanicEarningsService.create(createMechanicEarningDto);
  }

  @Get('mechanic/:mechanicId')
  findByMechanic(@Param('mechanicId') mechanicId: string) {
    return this.mechanicEarningsService.findByMechanic(mechanicId);
  }

  @Get('mechanic/:mechanicId/balance')
  getBalance(@Param('mechanicId') mechanicId: string) {
    return this.mechanicEarningsService.getBalance(mechanicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mechanicEarningsService.findOne(id);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  approvePayout(@Param('id') id: string) {
    return this.mechanicEarningsService.approvePayout(id);
  }

  @Patch(':id/mark-paid')
  @HttpCode(HttpStatus.OK)
  markAsPaid(@Param('id') id: string) {
    return this.mechanicEarningsService.markAsPaid(id);
  }

  @Patch(':id/mark-withdrawn')
  @HttpCode(HttpStatus.OK)
  markAsWithdrawn(@Param('id') id: string) {
    return this.mechanicEarningsService.markAsWithdrawn(id);
  }
}
