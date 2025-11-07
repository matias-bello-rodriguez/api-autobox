import { IsString, IsNotEmpty, IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateInspectionDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  inspectionDate: Date;

  @IsString()
  @IsNotEmpty()
  inspectionTime: string;

  @IsString()
  @IsNotEmpty()
  autoboxLocation: string;

  @IsNumber()
  price: number;
}
