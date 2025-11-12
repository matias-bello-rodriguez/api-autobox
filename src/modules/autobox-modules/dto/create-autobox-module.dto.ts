import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
  Min,
  Length,
} from 'class-validator';

export class CreateAutoboxModuleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  location: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  region: string;

  @IsString()
  @IsOptional()
  gasStationName?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsObject()
  @IsOptional()
  cameraInfo?: {
    brand?: string;
    model?: string;
    serialNumber?: string;
  };

  @IsObject()
  @IsOptional()
  networkInfo?: {
    provider?: string;
    connectionType?: string;
    bandwidth?: string;
  };

  @IsString()
  @IsOptional()
  chipCompany?: string;

  @IsString()
  @IsOptional()
  testCircuit?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  capacity?: number;

  @IsObject()
  @IsOptional()
  workingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}
