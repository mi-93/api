import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';
const helmet = require('helmet');

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Link File Share')
    .setDescription('Link File Share API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'Authorization',
    )
    // .addServer('/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('explorer', app, document);

  const configService: ConfigService = app.get(ConfigService);
  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('FB_PROJECT_ID'),
    privateKey: configService
      .get<string>('FB_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FB_CLIENT_EMAIL'),
  };
  console.log(adminConfig);
  // Initialize the firebase admin app
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
      databaseURL: configService.get<string>('FB_DATABASE_URL'),
    });
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();

  app.use(helmet());
  await app.listen(3000);
};
bootstrap();
