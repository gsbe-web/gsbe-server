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
export class Member extends BaseEntity {
  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  slug: string;

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  role?: string;

  @Prop()
  description?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  imageId?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  imageUrl?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  email?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  linkedinUrl?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  twitterUrl?: string;

  @Prop({
    unique: true,
    sparse: true,
    set: (v: string) => (v === '' ? null : v),
  })
  instagramUrl?: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
