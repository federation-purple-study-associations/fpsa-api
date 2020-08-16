import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as cookies from 'fastify-cookie';
import swaggerOptions from './swagger.document';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

require('dotenv').config();

async function build() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.register(cookies as any, {
        secret: process.env.COOKIE_SECRET, // for cookies signature
        parseOptions: {}     // options for parsing cookies
      });
    const document = SwaggerModule.createDocument(app, swaggerOptions);

    writeFileSync('./swagger-spec.json', JSON.stringify(document));
    process.exit();
}

build();