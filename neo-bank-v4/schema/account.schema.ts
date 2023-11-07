import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  sold: number;

  @Prop({ required: true })
  currency: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);