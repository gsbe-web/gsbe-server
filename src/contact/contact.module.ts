import { Module } from '@nestjs/common';
import { NotificationsModule } from '@notifications/notifications.module';

import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [NotificationsModule],
})
export class ContactModule {}
