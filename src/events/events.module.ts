import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

// GoogleDriveModule.register({
//   config,
//   folderId: '1PGr1Nk0YE9GPrNCflw_KPG9FeeYktoQP',
// }),
