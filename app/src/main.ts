import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as rfs from 'rotating-file-stream';
import * as morgan from 'morgan';
import * as path from 'path';
import './utils/prototypes/array';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('apiPrefix'));

  // Access Logger
  const accessLogStream = rfs.createStream('access.log', {
    size: config.get('accessLoggerFileSize'),
    interval: config.get('accessLoggerFileInterval'),
    compress: 'gzip',
    path: path.join(__dirname, '../../logs'),
  });
  app.use(morgan('combined', { stream: accessLogStream }));

  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: config.get('helmetContentSecurityPolicy'),
    })
  );

  // OpenAPI
  const openAPIConfig = new DocumentBuilder()
    .setTitle(config.get('openAPITitle'))
    .setDescription(config.get('openAPIDescription'))
    .setVersion(config.get('openAPIVersion'))
    .build();
  const document = SwaggerModule.createDocument(app, openAPIConfig);
  SwaggerModule.setup(config.get('openAPIPath'), app, document);

  // Start server
  await app.listen(config.get('port'));
  Logger.log(`🚀 Application is running on: http://localhost:${config.get('port')}/${config.get('apiPrefix')}`);
  Logger.log(`📚 OpenAPI documentation is running on: http://localhost:${config.get('port')}/${config.get('openAPIPath')}`);
}
bootstrap();
