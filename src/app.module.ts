import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from './data-source';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HelloWorldModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
