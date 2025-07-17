import { Document } from 'mongoose';

export class BaseEntity extends Document {
  createdAt: Date;
  updatedAt: Date;
}
