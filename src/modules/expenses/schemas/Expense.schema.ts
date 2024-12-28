import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ collection: 'expense' })
export class Expense {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'ExpenseCategory', required: true })
  expense_category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: false })
  comment: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
