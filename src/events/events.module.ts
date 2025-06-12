import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module';
import config from '../shared/config/config';
import { GoogleDriveModule } from '../google-drive/google-drive.module';

@Module({
  imports: [
    PrismaModule,
    GoogleDriveModule.register({
      config,
      folderId: '1PGr1Nk0YE9GPrNCflw_KPG9FeeYktoQP',
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
