import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import {
  CreateDueDto,
  FindDuesQueryDto,
  PaystackDataDto,
  PaystackWebhookDto,
} from './dto';
import { Due } from './entities';
import { PaystackService } from './paystack/paystack.service';

@Injectable()
export class DuesService {
  constructor(
    private readonly paystackService: PaystackService,
    @InjectModel(Due.name) private readonly dueModel: Model<Due>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(dto: CreateDueDto) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const due = new this.dueModel({ ...dto, status: 'pending' });
      await due.save({ session });

      const initResponse = await this.paystackService.initializePayment(
        {
          amount: dto.amount,
          currency: dto.currency,
        },
        dto.email,
        due._id as string,
      );

      await due.updateOne(
        {
          authorizationUrl: initResponse.data.authorizationUrl,
          accessCode: initResponse.data.accessCode,
        },
        { session },
      );

      await session.commitTransaction();
      return initResponse.data;
    } catch (error) {
      session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processWebhook(paystackWebhook: PaystackWebhookDto, signature: string) {
    await this.paystackService.verifyWebhook(paystackWebhook, signature);
    await this.update(paystackWebhook.data);
    return { status: 'OK' };
  }

  async update(event: PaystackDataDto) {
    const payment = await this.dueModel.findById(event.metadata.paymentId);
    if (!payment) {
      throw new Error('Due Payment not found');
    }

    const sourceNumber =
      event.channel === 'mobile_money'
        ? `${event.authorization.bin}${event.authorization.last4}`
        : event.authorization.last4;

    const paymentMethod =
      event.channel == 'mobile_money'
        ? event.authorization.bank
        : event.channel == 'card'
          ? event.authorization.brand
          : event.channel;

    await payment.updateOne({
      ...event,
      paymentMethod,
      sourceNumber,
      bankName: event.authorization.bank,
    });
    return;
  }

  async findAll(
    _query: FindDuesQueryDto,
  ): Promise<{ rows: Due[]; count: number }> {
    return { rows: [], count: 0 };
  }

  async findOne(_id: string): Promise<Due> {
    return;
  }

  async remove(_id: string): Promise<boolean> {
    return;
  }
}
