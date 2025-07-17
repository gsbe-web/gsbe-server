import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Event, EventSchema } from './entities';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

// GoogleDriveModule.register({
//   config,
//   folderId: '1PGr1Nk0YE9GPrNCflw_KPG9FeeYktoQP',
// }),
