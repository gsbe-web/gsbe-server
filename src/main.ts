import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('/api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GSBE Backend Service')
    .setDescription(
      'Backend housing all web api endpoints utilized by the client app',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(PORT);
  console.info(`SERVER IS RUNNING AT http://localhost:${PORT}`);
  console.info(`ACCESS SWAGGER DOCUMENTATION AT http://localhost:${PORT}/docs`);
}
bootstrap();
