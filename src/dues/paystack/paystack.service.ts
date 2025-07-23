import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { catchError, firstValueFrom } from 'rxjs';

import {
  InitializeResponseDto,
  MakePaymentDto,
  PaystackWebhookDto,
} from '../dto';

@Injectable()
export class PaystackService {
  private logger = new Logger(PaystackService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async initializePayment(
    payload: MakePaymentDto,
    email: string,
    paymentId: string,
  ) {
    const params = {
      amount: payload.amount * 100,
      email: email,
      currency: payload.currency,
      metadata: {
        paymentId,
      },
    };
    const response = await firstValueFrom(
      this.httpService.post('/transaction/initialize', params).pipe(
        catchError((err) => {
          this.logger.error('Paystack initialization error:', err);
          throw new BadRequestException('error in source. Details: ' + err);
        }),
      ),
    );
    return response.data as InitializeResponseDto;
  }

  async verifyWebhook(data: PaystackWebhookDto, signature: string) {
    const paystackSecret = this.configService.get<string>('PAYSTACK_API_KEY')!;
    const hmac = createHmac('sha512', paystackSecret);
    const expectedSignature = hmac.update(JSON.stringify(data)).digest('hex');

    if (signature !== expectedSignature) {
      throw new BadRequestException('Invalid signature');
    }
  }
}
