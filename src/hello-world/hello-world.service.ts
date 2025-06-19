import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  getWelcomeMessage(): string {
    return '🌍 Welcome aboard! This NestJS app is running smoothly.';
  }
}


