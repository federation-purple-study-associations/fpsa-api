import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SUPPORTED_LANGUAGES } from '../constants';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const queries: string = context.switchToHttp().getRequest().query.lang;
    if (queries && SUPPORTED_LANGUAGES.indexOf(queries) === -1) {
        throw new BadRequestException('Invalid language given...');
    }

    return next.handle();
  }
}
