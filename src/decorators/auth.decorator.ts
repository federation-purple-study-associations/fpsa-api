import { UnauthorizedException, CanActivate, Injectable, ExecutionContext, SetMetadata, CustomDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTransformer } from '../transformers/user.transformer';
import { FastifyReply } from 'fastify';

const errorNoAuthCookieFound = 'No authorization cookie has been found... Please make sure that you are logged in before performing this action';
const errorAuthCookieExpired = 'Token is invalid or expired...'

export const Auth: (scope: string) => CustomDecorator<string> = (scope: string) => SetMetadata('scope', scope);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const scope = this.reflector.get<string>('scope', context.getHandler());
    if (!scope) {
      return true;
    }

    const request: FastifyReply = context.switchToHttp().getRequest();
    if (!request.headers['cookie']) {
      throw new UnauthorizedException(errorNoAuthCookieFound);
    }
    const auth = AuthorizationGuard.parseCookies(request).auth;
    if (!auth) {
        throw new UnauthorizedException(errorNoAuthCookieFound);
    }

    try {
        return UserTransformer.hasScope(auth, scope);
    } catch {
        throw new UnauthorizedException(errorAuthCookieExpired);
    }
  }

  public static parseCookies(request: FastifyReply): any {
    const list = {};
    const rc = request.headers['cookie'];

    if (rc) {
      rc.split(';').forEach((cookie) => {
          const parts = cookie.split('=');
          list[parts.shift().trim()] = decodeURI(parts.join('='));
      });
    }

    return list;
  }
}
