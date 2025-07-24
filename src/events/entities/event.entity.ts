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
export class Event extends BaseEntity {
  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  imageId: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  imageUrl?: string;

  @Prop()
  title: string;

  @Prop()
  date: Date;

  @Prop()
  location: string;

  @Prop()
  description?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  slug: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
