import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/currentUser';
import { QueryParams, StatisticPayload } from '../types';
import { StatisticParams } from '../../decorators/statisticParams';

@Controller('/api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('expense')
  @UseGuards(AuthGuard)
  async getExpensesByDateAndCategory(
    @StatisticParams() params: QueryParams,
    @CurrentUser() userId: string,
  ) {
    const payload = { ...params, userId };
    return await this.statisticService.getExpenseByDateAndCategory(payload);
  }

  @Get('expense/total')
  @UseGuards(AuthGuard)
  async getAllExpenseCategories(
    @StatisticParams() params: QueryParams,
    @CurrentUser() userId: string,
  ) {
    const payload = { ...params, userId };
    const r = await this.statisticService.getAllExpenseCategories(payload);
    return r[0];
  }

  @Get()
  @UseGuards(AuthGuard)
  async getHistory(
    @StatisticParams() params: QueryParams,
    @CurrentUser() userId: string,
  ) {
    const payload = { ...params, userId };
    return await this.statisticService.getHistoryStatistic();
  }

  @Get('incomes')
  @UseGuards(AuthGuard)
  async getIncomesByDateAndCategory(
    @StatisticParams() params: QueryParams,
    @CurrentUser() userId: string,
  ) {
    const payload = { ...params, userId };
    return await this.statisticService.getIncomeByDateAndCategory(payload);
  }
}
