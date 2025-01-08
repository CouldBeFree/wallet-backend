import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateExpenseSubCategoryDto } from './dto/create-expense-sub-category.dto';
import { CurrentUser } from '../../decorators/currentUser';
import { ExpenseSubCategoryService } from './expense-sub-category.service';
import {
  CreateSubCategory,
  GetSubCategories,
  RemoveSubCategory,
  UpdateSubCategory,
} from './types';
import { UpdateExpenseSubCategoryDto } from './dto/update-expense-sub-category.dto';

@Controller('/api/expense-sub-category')
export class ExpenseSubCategoryController {
  constructor(private expenseSubCategoryService: ExpenseSubCategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createSubCategory(
    @Body() value: CreateExpenseSubCategoryDto,
    @CurrentUser() userId: string,
  ) {
    const payload: CreateSubCategory = {
      ...value,
      owner: userId,
    };
    await this.expenseSubCategoryService.getCategory(userId);
    return await this.expenseSubCategoryService.createSubCategory(payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeSubCategory(
    @CurrentUser() userId: string,
    @Param('id') expenseSubId: string,
  ) {
    const value: RemoveSubCategory = {
      owner: userId,
      expense_sub_category: expenseSubId,
    };
    await this.expenseSubCategoryService.removeSubCategory(value);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateSubCategory(
    @Body() data: UpdateExpenseSubCategoryDto,
    @CurrentUser() userId: string,
    @Param('id') expenseSubId: string,
  ) {
    const value: UpdateSubCategory = {
      name: data.name,
      owner: userId,
      expenseSubId,
      expense_category_icon: data.expense_category_icon,
    };
    return await this.expenseSubCategoryService.updateSubCategory(value);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getSubCategories(
    @CurrentUser() userId: string,
    @Param('id') expenseId: string,
  ) {
    const value: GetSubCategories = {
      owner: userId,
      expense_category: expenseId,
    };
    return this.expenseSubCategoryService.getSubCategories(value);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard)
  // async getSubCategoriesByCategory(
  //   @CurrentUser() userId: string,
  //   @Param('id') categoryId: string,
  // ) {
  //   return categoryId;
  // }
}
