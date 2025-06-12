import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndexModules } from './index.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ...IndexModules],
})
export class AppModule {}
