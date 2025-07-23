import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@shared/entities';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      const id = ret._id;
      delete ret._id;
      delete ret.__v;
      return { id, ...ret };
    },
  },
})
export class Due extends BaseEntity {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  membershipId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  reference: string;

  @Prop()
  currency: string;

  @Prop()
  amount: number;

  @Prop()
  status: string;

  @Prop()
  paidAt: Date;

  @Prop()
  accessCode: string;

  @Prop()
  authorizationUrl: string;

  @Prop()
  channel: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  sourceNumber: string;

  @Prop()
  bankName: string;

  @Prop({ default: 'paystack' })
  provider: string;
}

export const DueSchema = SchemaFactory.createForClass(Due);
