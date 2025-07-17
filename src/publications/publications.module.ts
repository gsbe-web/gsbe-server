import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Publication, PublicationSchema } from './entities';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publication.name, schema: PublicationSchema },
    ]),
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}

// GoogleDriveModule.register({
//   config,
//   folderId: '1-BvLImf1GAfcu8N-YWBAVK-hV9ooRnTD',
// }),
