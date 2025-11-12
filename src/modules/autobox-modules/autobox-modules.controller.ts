import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AutoboxModulesService } from './autobox-modules.service';
import { CreateAutoboxModuleDto } from './dto/create-autobox-module.dto';
import { UpdateAutoboxModuleDto } from './dto/update-autobox-module.dto';

@Controller('autobox-modules')
export class AutoboxModulesController {
  constructor(private readonly autoboxModulesService: AutoboxModulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAutoboxModuleDto: CreateAutoboxModuleDto) {
    return this.autoboxModulesService.create(createAutoboxModuleDto);
  }

  @Get()
  findAll(@Query('active') active?: string, @Query('region') region?: string) {
    if (region) {
      return this.autoboxModulesService.findByRegion(region);
    }
    if (active === 'true') {
      return this.autoboxModulesService.findActive();
    }
    return this.autoboxModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autoboxModulesService.findOne(id);
  }

  @Get(':id/capacity')
  getCapacityStatus(@Param('id') id: string) {
    return this.autoboxModulesService.getCapacityStatus(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAutoboxModuleDto: UpdateAutoboxModuleDto,
  ) {
    return this.autoboxModulesService.update(id, updateAutoboxModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.autoboxModulesService.remove(id);
  }
}
