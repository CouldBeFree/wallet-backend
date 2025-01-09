import { IsOptional, IsString } from 'class-validator';

export class UpdateExpenseSubCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  expense_category_icon: string;
}
