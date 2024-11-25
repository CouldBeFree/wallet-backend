import { IsNumber, IsString } from 'class-validator';

export class CreateExpenseCategoryDto {
  @IsString()
  expense_category: string;

  @IsNumber()
  amount: number;

  @IsString()
  date: string;
}
