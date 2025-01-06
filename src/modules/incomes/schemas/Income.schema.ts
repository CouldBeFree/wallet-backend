import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IncomeDocument = HydratedDocument<Income>;

@Schema({ collection: 'income' })
export class Income {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'IncomeCategory', required: true })
  income_category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
