import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configurar CORS
  app.enableCors();

  // Configurar validación de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Configurar archivos estáticos
  //app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
