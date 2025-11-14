import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { GetPresignedDownloadUrlDto } from './dto/get-presigned-download-url.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-upload')
  async generatePresignedUploadUrl(@Body() dto: GeneratePresignedUrlDto) {
    return this.uploadsService.generatePresignedUploadUrl(dto);
  }

  @Post('presigned-download')
  async generatePresignedDownloadUrl(@Body() dto: GetPresignedDownloadUrlDto) {
    return this.uploadsService.generatePresignedDownloadUrl(dto);
  }

  @Post('presigned-upload-multiple')
  async generateMultiplePresignedUploadUrls(
    @Body() body: { files: GeneratePresignedUrlDto[] },
  ) {
    return this.uploadsService.generateMultiplePresignedUploadUrls(body.files);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    return this.uploadsService.deleteFile(key);
  }
}
