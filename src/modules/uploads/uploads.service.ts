import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client } from '../../config/aws.config';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { GetPresignedDownloadUrlDto } from './dto/get-presigned-download-url.dto';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = createS3Client(configService);
    this.bucketName = configService.get<string>('AWS_S3_BUCKET_NAME') || '';
  }

  /**
   * Genera una URL firmada para subir un archivo directamente a S3
   * @param dto Datos del archivo a subir
   * @returns URL firmada válida por 1 hora
   */
  async generatePresignedUploadUrl(dto: GeneratePresignedUrlDto) {
    const { fileName, fileType, folder = 'uploads' } = dto;
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hora
    });

    return {
      uploadUrl,
      key,
      publicUrl: `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`,
    };
  }

  /**
   * Genera una URL firmada para descargar un archivo desde S3
   * @param dto Datos del archivo a descargar
   * @returns URL firmada válida por 1 hora
   */
  async generatePresignedDownloadUrl(dto: GetPresignedDownloadUrlDto) {
    const { key } = dto;

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hora
    });

    return {
      downloadUrl,
      key,
    };
  }

  /**
   * Elimina un archivo de S3
   * @param key Clave del archivo en S3
   */
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);

    return {
      message: 'Archivo eliminado correctamente',
      key,
    };
  }

  /**
   * Genera múltiples URLs firmadas para subir varios archivos
   * @param files Array de archivos a subir
   */
  async generateMultiplePresignedUploadUrls(files: GeneratePresignedUrlDto[]) {
    const urls = await Promise.all(
      files.map((file) => this.generatePresignedUploadUrl(file)),
    );

    return {
      urls,
      count: urls.length,
    };
  }

  /**
   * Convierte una URL pública de S3 a una URL firmada
   * @param s3Url URL pública de S3
   * @returns URL firmada válida por 1 hora
   */
  async getSignedUrlFromPublicUrl(s3Url: string): Promise<string> {
    // Extraer el key de la URL de S3
    const urlPattern = new RegExp(
      `https://${this.bucketName}\\.s3\\.[^/]+\\.amazonaws\\.com/(.+)`,
    );
    const match = s3Url.match(urlPattern);
    
    if (!match) {
      throw new Error('URL de S3 inválida');
    }

    const key = match[1];

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hora
    });
  }
}
