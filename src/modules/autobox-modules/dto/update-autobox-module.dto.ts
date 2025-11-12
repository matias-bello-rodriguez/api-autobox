import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoboxModuleDto } from './create-autobox-module.dto';

export class UpdateAutoboxModuleDto extends PartialType(
  CreateAutoboxModuleDto,
) {}
