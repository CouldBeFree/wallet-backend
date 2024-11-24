import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(private expenseService: ExpensesService) {}

  // @UseGuards(AuthGuard)
  @Get('categories')
  @UseGuards(AuthGuard)
  async getCategories(): Promise<ExpensesCategoriesDto[]> {
    return await this.expenseService.getAllExpenseCategories();
  }
}
