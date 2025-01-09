import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QueryParams } from '../modules/types';
import getCurrentISODate from '../utils/getCurrentISODate';

type RequestQuery = {
  categoryId: string[] | string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  page: string | undefined;
  pageSize: string | undefined;
};

export const StatisticParams = createParamDecorator(
  (data: unknown, context: ExecutionContext): QueryParams => {
    const request = context.switchToHttp().getRequest();
    const { categoryId, startDate, endDate, page, pageSize }: RequestQuery =
      request.query;
    const cat = Array.isArray(categoryId)
      ? categoryId
      : categoryId
      ? [categoryId]
      : null;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const initialDate = startDate
      ? new Date(startDate)
      : new Date('2000-01-01');
    const finalDate = endDate
      ? new Date(endDate)
      : (getCurrentISODate() as unknown as Date);
    return {
      startDate: initialDate,
      endDate: finalDate,
      page: pageNumber,
      pageSize: size,
      categoryId: cat,
    };
  },
);
