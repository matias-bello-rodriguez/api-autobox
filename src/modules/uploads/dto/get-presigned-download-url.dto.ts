import { IsNotEmpty, IsString } from 'class-validator';

export class GetPresignedDownloadUrlDto {
  @IsNotEmpty()
  @IsString()
  key: string;
}
