import { Module } from '@nestjs/common';
import { GreetController } from './app.controller';
import { GreetService } from './app.service';

@Module({
  imports: [],
  controllers: [GreetController],
  providers: [GreetService],
})
export class HelloWorld {}
