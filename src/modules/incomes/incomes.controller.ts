import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
