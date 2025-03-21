import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';
import { TokenService } from '../shared/services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return true;

    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }
    const token = authorization.replace(/bearer/gim, '').trim();
    if (!token) {
      throw new UnauthorizedException(
        'No token provided. Please provide a token first and try again.',
      );
    }

    const userVerify = this.tokenService.verifyToken(token);
    if (!userVerify) {
      throw new UnauthorizedException(
        'Invalid token. Please provide a correct token and try again.',
      );
    }

    request.user = userVerify;

    return true;
  }
}
