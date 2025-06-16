import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  private readonly logger = new Logger(HelloWorldService.name);

  constructor() {
    this.logger.log('HelloWorldService initialized');
  }

  /**
   * Returns a standard greeting message.
   */
  getHello(): string {
    this.logger.debug('Generating default greeting message');

    const message = 'Hello World! This is my first NestJS API endpoint project.';
    const timestamp = this.getCurrentTimestamp();

    return this.formatResponse(message, timestamp);
  }

  /**
   * Returns a personalized greeting based on the user's name.
   * @param name - The name of the user
   */
  getPersonalizedGreeting(name: string): string {
    this.logger.debug(`Generating personalized greeting for: ${name}`);

    const message = `Hello, ${name}! Welcome to the enhanced NestJS API experience.`;
    const timestamp = this.getCurrentTimestamp();

    return this.formatResponse(message, timestamp);
  }

  /**
   * Simulates a delayed asynchronous greeting message.
   * Can be extended to fetch data from a database or external API.
   */
  async getAsyncGreeting(name?: string): Promise<string> {
    this.logger.debug(`Processing async greeting for: ${name || 'Guest'}`);

    await this.delay(500); // Simulate delay or IO
    return name
      ? this.getPersonalizedGreeting(name)
      : this.getHello();
  }

  /**
   * Utility method to get the current ISO timestamp.
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Formats a message with a timestamp for consistency.
   */
  private formatResponse(message: string, timestamp: string): string {
    return `${message} [Timestamp: ${timestamp}]`;
  }

  /**
   * Helper method to simulate a delay (e.g., for async operations).
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
