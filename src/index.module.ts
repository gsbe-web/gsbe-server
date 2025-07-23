import { CloudinaryModule } from '@cloudinary/cloudinary.module';
import { DuesModule } from '@dues/dues.module';
import { EventsModule } from '@events/events.module';
import { GoogleDriveModule } from '@google-drive/google-drive.module';
import { MembersModule } from '@members/members.module';
import { PublicationsModule } from '@publications/publications.module';

export const IndexModules = [
  PublicationsModule,
  EventsModule,
  CloudinaryModule,
  GoogleDriveModule,
  MembersModule,
  DuesModule,
];
