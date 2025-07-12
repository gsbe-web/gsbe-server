import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}

// GoogleDriveModule.register({
//   config,
//   folderId: '1-BvLImf1GAfcu8N-YWBAVK-hV9ooRnTD',
// }),
