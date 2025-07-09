import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexModules } from './index.module';
import { AppController } from './app.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    ...IndexModules,
  ],
  controllers: [AppController],
})
export class AppModule {}
