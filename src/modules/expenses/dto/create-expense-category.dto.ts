import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from '../../../decorators/custom-validator/isObjectId';

export class CreateExpenseCategoryDto {
  @IsObjectId({ message: 'Expense category must be a valid MongoDB ObjectId' })
  expense_category: string;

  @IsNumber()
  amount: number;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  expense_sub_category: string;
}
