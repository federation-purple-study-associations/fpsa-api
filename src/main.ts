import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import * as multipart from 'fastify-multipart';
import * as cookies from 'fastify-cookie';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import swaggerOptions from './swagger/swagger.document';
import { LanguageInterceptor } from './interceptors/language.interceptor';

const bootstrap: () => Promise<void> = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Enable multipart for file uploads
  app.register(multipart as any, {
    addToBody: true,
    sharedSchemaId: 'MultipartFileType',
  });

  // Enable cookies for authorization
  app.register(cookies as any, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
    parseOptions: {},     // options for parsing cookies
  });

  // Enable model validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable language interceptor
  app.useGlobalInterceptors(new LanguageInterceptor());

  // Enable cors
  app.enableCors({
    origin: ['http://localhost:8080', 'https://fpsa.nl', 'http://localhost:3000/', 'https://www.fpsa.nl', 'http://beta.fpsa.nl', 'https://beta.fpsa.nl'],
    credentials: true,
  });

  // Enable Swagger
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
