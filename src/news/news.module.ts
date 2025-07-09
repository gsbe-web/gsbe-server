import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}

// GoogleDriveModule.register({
//   config,
//   folderId: '1-BvLImf1GAfcu8N-YWBAVK-hV9ooRnTD',
// }),
