import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/currentUser';
import { StatisticPayload } from '../types';
import getCurrentISODate from '../../utils/getCurrentISODate';

@Controller('/api/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get('expense')
  @UseGuards(AuthGuard)
  async getExpensesByDateAndCategory(
    @CurrentUser() userId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('categoryId') categoryId: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const initialDate = startDate
      ? new Date(startDate)
      : new Date('2000-01-01');
    const finalDate = endDate
      ? new Date(endDate)
      : (getCurrentISODate() as unknown as Date);

    const payload: StatisticPayload = {
      startDate: initialDate,
      endDate: finalDate,
      userId,
      page: pageNumber,
      pageSize: size,
      categoryId,
    };

    const res = await this.statisticService.getExpenseByDateAndCategory(
      payload,
    );
    return {
      data: res,
      count: res.length,
    };
  }
}
