import { EventsModule } from './events/events.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';

export const IndexModules = [
  PrismaModule,
  NewsModule,
  EventsModule,
  GoogleDriveModule,
];
