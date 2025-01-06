import { IsObjectId } from '../../../decorators/custom-validator/isObjectId';
import { IsString } from 'class-validator';

export class CreateExpenseSubCategoryDto {
  @IsObjectId({ message: 'Expense category must be a valid MongoDB ObjectId' })
  expense_category: string;

  @IsString()
  name: string;
}
