import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PaystackService } from './paystack.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        baseURL: 'https://api.paystack.co',
        headers: {
          Authorization: `Bearer ${configService.get('PAYSTACK_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PaystackService],
  exports: [PaystackService],
})
export class PaystackModule {}
