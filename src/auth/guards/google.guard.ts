import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const { state } = req.query;
    if (state) {
      return { state };
    }
    return undefined;
  }
}
