import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    Logger,
    Query,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { HelloWorldService } from './hello.world.service';

@Controller('hello-world')
export class HelloWorldController {
  private readonly logger = new Logger(HelloWorldController.name);

  constructor(
    @Inject(HelloWorldService)
    private readonly helloWorldService: HelloWorldService,
  ) {}

  /**
   * GET /hello-world
   * Optionally accepts a name query param to personalize the greeting.
   * Returns a structured JSON response with status and message.
   */
  @Get()
  async getHello(
    @Query('name') name: string,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Received request to /hello-world with name: ${name || 'Anonymous'}`);

    try {
      const message = name
        ? this.helloWorldService.getPersonalizedGreeting(name)
        : this.helloWorldService.getHello();

      const responsePayload = {
        status: 'success',
        timestamp: new Date().toISOString(),
        message,
      };

      res.status(HttpStatus.OK).json(responsePayload);
    } catch (error) {
      this.logger.error('Error in getHello:', error.message);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while processing your request.',
      });
    }
  }
}
