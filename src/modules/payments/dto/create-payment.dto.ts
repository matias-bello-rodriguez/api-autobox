import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  inspectionId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
