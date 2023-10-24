import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop()
    name: string;

    @Prop({ required: true, type: Array })
    accounts: Array<{ currency: string, sum: number}>;

}

export const UserSchema = SchemaFactory.createForClass(User);