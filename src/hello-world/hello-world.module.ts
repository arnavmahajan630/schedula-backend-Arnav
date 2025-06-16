import { Logger, Module } from '@nestjs/common';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';

@Module({
  // Declares the controller that handles HTTP requests for this module
  controllers: [HelloWorldController],

  // Declares the providers (services) that contain business logic
  providers: [
    HelloWorldService,
    Logger, // Providing NestJS built-in Logger for better observability
  ],

  // If this module's service needs to be used in other modules, export it
  exports: [HelloWorldService],
})
export class HelloWorldModule {
  constructor(private readonly logger: Logger) {
    this.logger.log(
      'HelloWorldModule initialized successfully 🚀',
      HelloWorldModule.name,
    );
  }
}
