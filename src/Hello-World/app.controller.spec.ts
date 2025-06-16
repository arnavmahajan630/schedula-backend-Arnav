import { Test, TestingModule } from '@nestjs/testing';
import {GreetController } from './app.controller';
import {GreetService } from './app.service';

describe('AppController', () => {
  let greetcontroller: GreetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GreetController],
      providers: [GreetService],
    }).compile();

    greetcontroller = app.get<GreetController>(GreetController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(greetcontroller.getHello()).toBe('Hello World!');
    });
  });
});
