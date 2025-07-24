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
export class Publication extends BaseEntity {
  @Prop()
  username: string;

  @Prop()
  dateTimePosted: Date;

  @Prop()
  profileImageUrl: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  postImageId: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  postImageUrl?: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  slug: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
