import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { CurrentUser } from '../../decorators/currentUser';
import { CreateExpenseCategoryResponseDto } from './dto/create-expense-category-reponse.dto';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(private expenseService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(
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
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllExpenses(
    @CurrentUser() userId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    return await this.expenseService.getAllExpenses(userId, pageNumber, size);
  }

  @Get('categories')
  @UseGuards(AuthGuard)
  async getCategories(): Promise<ExpensesCategoriesDto[]> {
    return await this.expenseService.getAllExpenseCategories();
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
