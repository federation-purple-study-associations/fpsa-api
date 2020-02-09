import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import swaggerOptions from './swagger.document';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

require('dotenv').config();

async function build() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    const document = SwaggerModule.createDocument(app, swaggerOptions);

    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
    process.exit();
}

build();