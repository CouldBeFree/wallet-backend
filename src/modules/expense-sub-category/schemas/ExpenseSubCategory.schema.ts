import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExpenseSubCategoryDocument = HydratedDocument<ExpenseSubCategory>;

@Schema({ collection: 'expense_sub_category' })
export class ExpenseSubCategory {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ type: Types.ObjectId, ref: 'ExpenseCategory', required: true })
  expense_category: string;
}

export const ExpenseSubCategorySchema =
  SchemaFactory.createForClass(ExpenseSubCategory);