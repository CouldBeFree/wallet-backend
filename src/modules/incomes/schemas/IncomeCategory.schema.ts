import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IncomeCategoryDocument = HydratedDocument<IncomeCategory>;

@Schema({ collection: 'income_category' })
export class IncomeCategory {
  @Prop()
  name: string;
}

export const IncomeCategorySchema =
  SchemaFactory.createForClass(IncomeCategory);
