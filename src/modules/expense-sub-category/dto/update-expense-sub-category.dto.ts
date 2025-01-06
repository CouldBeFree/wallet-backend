import { IsString } from 'class-validator';

export class UpdateExpenseSubCategoryDto {
  @IsString()
  name: string;
}
