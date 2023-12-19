import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {

  @ApiProperty({ description: 'Unique identifier of the payment', example: '12345' })
  @Prop({ required: true })
  id: string;

  @ApiProperty({ description: 'User ID associated with the payment', example: 101 })
  @Prop({ required: true })
  idUser: number;

  @ApiProperty({ description: 'Amount of the payment', example: 100.50 })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Source currency of the payment', example: 'USD' })
  @Prop({ required: true })
  source_currency: string;

  @ApiProperty({ description: 'Target currency of the payment', example: 'EUR' })
  @Prop({ required: true })
  target_currency: string;

  @ApiProperty({ description: 'Status of the payment', example: 'pending' })
  @Prop({ required: true })
  status: string;

  @ApiProperty({ description: 'Credited account ID, if applicable', required: false, example: '98765' })
  @Prop()
  idCredited?: string;

  constructor(id: string, idUser: number, amount: number, source_currency: string, target_currency: string, status: string, idCredited?: string) {
    this.id = id;
    this.idUser = idUser;
    this.amount = amount;
    this.source_currency = source_currency;
    this.target_currency = target_currency;
    this.status = status;
    this.idCredited = idCredited;
  }
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
