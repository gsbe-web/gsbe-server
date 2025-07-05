import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexModules } from './index.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...IndexModules],
  controllers: [AppController],
})
export class AppModule {}
