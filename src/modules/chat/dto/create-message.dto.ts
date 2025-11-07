import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;
}
