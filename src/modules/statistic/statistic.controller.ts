import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/currentUser';
import { QueryParams, StatisticPayload } from '../types';
import getCurrentISODate from '../../utils/getCurrentISODate';
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
    const res = await this.statisticService.getExpenseByDateAndCategory(
      payload,
    );
    return {
      data: res,
      count: res.length,
    };
  }

  @Get('incomes')
  @UseGuards(AuthGuard)
  async getIncomesByDateAndCategory(
    @StatisticParams() params: QueryParams,
    @CurrentUser() userId: string,
  ) {
    const payload = { ...params, userId };
    const res = await this.statisticService.getIncomeByDateAndCategory(payload);
    return {
      data: res,
      count: res.length,
    };
  }
}
