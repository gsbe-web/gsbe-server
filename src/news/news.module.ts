import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaModule } from '../prisma/prisma.module';
import config from '../shared/config/config';
import { GoogleDriveModule } from '../google-drive/google-drive.module';

@Module({
  imports: [
    PrismaModule,
    GoogleDriveModule.register({
      config,
      folderId: '1-BvLImf1GAfcu8N-YWBAVK-hV9ooRnTD',
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
