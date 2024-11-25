import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { AuthGuard } from '../../guards/auth.guard';
import { IncomesCategoriesDto } from './dto/incomes-categories.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CurrentUser } from '../../decorators/currentUser';
import { CreateIncomeResponseDto } from './dto/create-income-response.dto';

@Controller('/api/incomes')
export class IncomesController {
  constructor(private incomesService: IncomesService) {}

  @Get('categories')
  @UseGuards(AuthGuard)
  async getCategories(): Promise<IncomesCategoriesDto[]> {
    return await this.incomesService.getAllExpenseCategories();
  }

  @Post()
  @UseGuards(AuthGuard)
  async createIncome(
    @Body() createIncomeDto: CreateIncomeDto,
    @CurrentUser() userId: string,
  ): Promise<CreateIncomeResponseDto> {
    return await this.incomesService.createIncome(createIncomeDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllIncomes(
    @CurrentUser() userId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    return await this.incomesService.getAllIncomes(userId, pageNumber, size);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeIncome(@Param('id') expenseId: string): Promise<SuccessResponse> {
    const removedItem = await this.incomesService.removeExpense(expenseId);
    if (removedItem) {
      return {
        success: true,
      };
    }
    throw new NotFoundException('Income not found');
  }
}
