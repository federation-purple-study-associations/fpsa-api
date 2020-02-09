import { Injectable } from '@nestjs/common';

@Injectable()
export class AgendaRepository {
  getHello(): string {
    return 'Hello World!';
  }
}
