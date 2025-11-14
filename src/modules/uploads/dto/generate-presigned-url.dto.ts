import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsString()
  folder?: string;
}
