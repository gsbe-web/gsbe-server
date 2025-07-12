import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EventsModule } from './events/events.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicationsModule } from './publications/publications.module';

export const IndexModules = [
  PrismaModule,
  PublicationsModule,
  EventsModule,
  CloudinaryModule,
  GoogleDriveModule,
];
