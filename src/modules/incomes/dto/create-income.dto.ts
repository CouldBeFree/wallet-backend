import { IsNumber, IsString } from 'class-validator';
import { IsObjectId } from '../../../decorators/custom-validator/isObjectId';

export class CreateIncomeDto {
  @IsObjectId({ message: 'Income category must be a valid MongoDB ObjectId' })
  income_category: string;

  @IsNumber()
  amount: number;

  @IsString()
  date: string;
}
