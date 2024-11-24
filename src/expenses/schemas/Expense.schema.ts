import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ collection: 'expense' })
export class Expense {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;
}

export const ExpenseCategorySchema = SchemaFactory.createForClass(Expense);
