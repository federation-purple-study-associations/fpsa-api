import { Controller, Post, Req } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as path from 'path';
import * as pump from 'pump';

@Controller('agenda')
export class AgendaController {
  
  @Post()
  createNew(@Req() req): Promise<void> {
    return new Promise((resolve) => {
      function onEnd() {
        console.log('upload completed')
        resolve();
      }
    
      function handler (field, file) {
        pump(file, createWriteStream(path.resolve(__dirname, 'files')))
      }

      req.multipart(handler, onEnd);
    })
  }
}
