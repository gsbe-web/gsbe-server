import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { IndexModules } from './index.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...IndexModules,
    MembersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
