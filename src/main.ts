import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupCors } from './setup-cors';
import { getConfig } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = getConfig().port;
  const host = getConfig().host;
  const isProduction = getConfig().node_env === 'production';

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupCors(app);

  const options = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API Gateway')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  if (isProduction) {
    Logger.log(`[Swagger link] https://${host}/api/#/`);
  } else {
    Logger.log(`[Swagger link] http://${host}:${port}/api/#/`);
  }
}
bootstrap();
