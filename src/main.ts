import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(
    `🚀 Application is running on Port: ${port}, in ${process.env.NODE_ENV || 'development'} environment`,
  );
}
bootstrap();
