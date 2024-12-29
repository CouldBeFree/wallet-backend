import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://wallet-backend-production-54e7.up.railway.app'],
  });
  await app.listen(3000);
}
bootstrap();
