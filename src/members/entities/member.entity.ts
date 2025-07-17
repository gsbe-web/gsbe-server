import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseEntity } from '../../shared/entities';

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
  @Prop({ unique: true })
  slug: string;

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  role?: string;

  @Prop()
  description?: string;

  @Prop({ unique: true })
  imageId?: string;

  @Prop({ unique: true })
  imageUrl?: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ unique: true })
  linkedinUrl?: string;

  @Prop({ unique: true })
  twitterUrl?: string;

  @Prop({ unique: true })
  instagramUrl?: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
