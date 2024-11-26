import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ExpenseCategory } from '../expenses/schemas/ExpenseCategory.schema';
import { Model } from 'mongoose';
import { Expense } from '../expenses/schemas/Expense.schema';
import { StatisticPayload } from '../types';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private expenseCategory: Model<ExpenseCategory>,
    @InjectModel(Expense.name)
    private expense: Model<Expense>,
  ) {}

  async getExpenseByDateAndCategory(payload: StatisticPayload) {
    const { userId, categoryId, startDate, endDate } = payload;
    try {
      return this.expense.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            owner: userId,
            ...(categoryId && {
              expense_category: {
                $in: Array.isArray(categoryId) ? categoryId : [categoryId],
              },
            }),
          },
        },
        {
          $addFields: {
            expense_category_objectId: { $toObjectId: '$expense_category' },
          },
        },
        {
          $lookup: {
            from: 'expense_category',
            localField: 'expense_category_objectId',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails',
        },
        {
          $group: {
            _id: '$categoryDetails.name',
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            categoryName: '$_id',
            totalAmount: 1,
          },
        },
      ]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
