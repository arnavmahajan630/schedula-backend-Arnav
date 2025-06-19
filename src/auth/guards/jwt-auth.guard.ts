import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access-token') {}
@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {}
