import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Payment } from '../src/entities/payment.entity';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  sold: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  payments: Payment[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);