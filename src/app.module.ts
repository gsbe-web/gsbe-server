import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { IndexModules } from './index.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...IndexModules],
  controllers: [AppController],
})
export class AppModule {}
