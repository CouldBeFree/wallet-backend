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
import { StatisticParams } from '../../decorators/statisticParams';
import { QueryParams } from '../types';

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
    @StatisticParams() params: QueryParams,
  ) {
    const payload = { ...params, userId };
    return await this.incomesService.getAllIncomes(payload);
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
