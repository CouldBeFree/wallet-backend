import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { CurrentUser } from '../../decorators/currentUser';
import { CreateExpenseCategoryResponseDto } from './dto/create-expense-category-reponse.dto';
import { QueryParams, UpdateExpense } from '../types';
import { StatisticParams } from '../../decorators/statisticParams';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(private expenseService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createExpense(
    @Body() createExpenseCategory: CreateExpenseCategoryDto,
    @CurrentUser() userId: string,
  ): Promise<CreateExpenseCategoryResponseDto> {
    const res = await this.expenseService.createExpense(
      createExpenseCategory,
      userId,
    );
    return new CreateExpenseCategoryResponseDto(
      res._id.toString(),
      res.amount,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.expense_category?.name,
      res.comment,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateExpense(
    @Body() createExpenseCategory: CreateExpenseCategoryDto,
    @CurrentUser() userId: string,
    @Param('id') incomeId: string,
  ) {
    const payload: UpdateExpense = {
      userId,
      incomeId,
      ...createExpenseCategory,
    };
    return await this.expenseService.updateIncome(payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllExpenses(
    @CurrentUser() userId: string,
    @StatisticParams() params: QueryParams,
  ) {
    const payload = { ...params, userId };
    return await this.expenseService.getAllExpenses(payload);
  }

  @Get('categories')
  @UseGuards(AuthGuard)
  async getCategories(): Promise<ExpensesCategoriesDto[]> {
    return await this.expenseService.getAllExpenseCategories();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getExpense(
    @Param('id') expenseCategoryId: string,
    @CurrentUser() userId: string,
  ) {
    const payload = { userId, expenseCategoryId };
    const cat = await this.expenseService.getCategory(expenseCategoryId);
    if (!cat) throw new NotFoundException('Category not found');
    const data = await this.expenseService.getExpense(payload);
    if (!data.length) {
      return {
        totalAmount: 0,
        expense: cat.name,
      };
    }
    return data[0];
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeExpense(
    @Param('id') expenseId: string,
  ): Promise<SuccessResponse> {
    const removedItem = await this.expenseService.removeExpense(expenseId);
    if (removedItem) {
      return {
        success: true,
      };
    }
    throw new NotFoundException('Expense not found');
  }
}
