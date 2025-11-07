import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Permitir todas las conexiones en desarrollo
  app.enableCors({
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Escuchar en todas las interfaces
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📱 Para móviles usa: http://192.168.0.19:${port}/api`);
}
bootstrap();

