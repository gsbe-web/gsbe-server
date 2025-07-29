import { Global, Module } from '@nestjs/common';

import { EmailModule } from './email/email.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [EmailModule],
  exports: [EmailModule],
})
export class NotificationsModule {}
