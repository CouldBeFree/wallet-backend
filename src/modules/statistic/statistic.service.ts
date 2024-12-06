import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from '../expenses/schemas/Expense.schema';
import { Income } from '../incomes/schemas/Income.schema';
import { StatisticPayload } from '../types';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Expense.name)
    private expense: Model<Expense>,
    @InjectModel(Income.name)
    private income: Model<Expense>,
  ) {}

  async getHistoryStatistic() {
    try {
      const [expenses, incomes] = await Promise.all([
        this.expense.find().sort({ date: -1 }).lean(),
        this.income.find().sort({ date: -1 }).lean(),
      ]);

      return [...expenses, ...incomes];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  async getAllExpenseCategories(payload: StatisticPayload) {
    const { userId, startDate, endDate } = payload;
    try {
      return this.expense.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            owner: userId,
          },
        },
        {
          $group: {
            _id: 'owner',
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $project: {
            type: 'expense',
            _id: 0,
            totalAmount: 1,
          },
        },
      ]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

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
                $in: categoryId,
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

  async getIncomeByDateAndCategory(payload: StatisticPayload) {
    const { userId, categoryId, startDate, endDate } = payload;
    try {
      return this.income.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
            owner: userId,
            ...(categoryId && {
              income_category: {
                $in: categoryId,
              },
            }),
          },
        },
        {
          $addFields: {
            income_category_objectId: { $toObjectId: '$income_category' },
          },
        },
        {
          $lookup: {
            from: 'income_category',
            localField: 'income_category_objectId',
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
