import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionDto } from './create-inspection.dto';
import { IsString, IsOptional, IsJSON } from 'class-validator';

export class UpdateInspectionDto extends PartialType(CreateInspectionDto) {
  @IsString()
  @IsOptional()
  status?: string;

  @IsJSON()
  @IsOptional()
  results?: any;

  @IsString()
  @IsOptional()
  notes?: string;
}
