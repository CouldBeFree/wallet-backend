import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseCategoryDocument = HydratedDocument<ExpenseCategory>;

@Schema({ collection: 'expense_category' })
export class ExpenseCategory {
  @Prop()
  name: string;
}

export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);
