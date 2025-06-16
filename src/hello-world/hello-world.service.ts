import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  getHello(): string {
    return 'Hello World! My first NestJS api endpoint';
  }
}
