import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMechanicEarningDto {
  @IsUUID()
  mechanicId: string;

  @IsUUID()
  inspectionId: string;

  @IsUUID()
  paymentId: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionRate?: number; // Si no se provee, se usa el default (70%)

  @IsNumber()
  @Min(0)
  earnedAmount: number;

  @IsNumber()
  @Min(0)
  platformFee: number;
}
