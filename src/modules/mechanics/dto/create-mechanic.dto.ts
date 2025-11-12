import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateMechanicDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 12)
  rut: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  @Length(8, 20)
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsArray()
  @IsOptional()
  certifications?: string[];

  @IsBoolean()
  @IsOptional()
  backgroundCheck?: boolean;

  @IsString()
  @IsOptional()
  chipNumber?: string;

  @IsString()
  @IsOptional()
  cameraNumber?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1.0)
  @Max(5.0)
  rating?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
