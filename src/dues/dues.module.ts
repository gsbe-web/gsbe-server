import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DuesController } from './dues.controller';
import { DuesService } from './dues.service';
import { Due, DueSchema } from './entities';
import { PaystackModule } from './paystack/paystack.module';

@Module({
  imports: [
    PaystackModule,
    MongooseModule.forFeature([{ name: Due.name, schema: DueSchema }]),
  ],
  controllers: [DuesController],
  providers: [DuesService],
})
export class DuesModule {}
