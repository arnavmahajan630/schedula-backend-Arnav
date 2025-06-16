import { NestFactory } from '@nestjs/core';
import { HelloWorld } from './Hello-World/app.module';

async function bootstrap() {
  const app = await NestFactory.create(HelloWorld);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
