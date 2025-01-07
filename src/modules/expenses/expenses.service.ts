import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseCategory } from './schemas/ExpenseCategory.schema';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { Expense } from './schemas/Expense.schema';
import { ExpenseAggregationResult } from './types';
import { GetExpense, StatisticPayload, UpdateExpense } from '../types';
import { ExpenseSubCategory } from '../expense-sub-category/schemas/ExpenseSubCategory.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(ExpenseSubCategory.name)
    private expenseSubCategory: Model<ExpenseSubCategory>,
    @InjectModel(ExpenseCategory.name)
    private expenseCategory: Model<ExpenseCategory>,
    @InjectModel(Expense.name)
    private expense: Model<Expense>,
  ) {}

  async createExpense(payload: CreateExpenseCategoryDto, userId: string) {
    const isExpenseCategoryExists = await this.getExpenseCategoryById(
      payload.expense_category,
    );
    if (!isExpenseCategoryExists)
      throw new BadRequestException("Expense category doesn't exists");
    if (payload.expense_sub_category_id) {
      const isSubCategoryExists = await this.expenseSubCategory.findOne({
        $and: [
          { owner: userId },
          { expense_category: payload.expense_category },
          { _id: payload.expense_sub_category_id },
        ],
      });
      if (!isSubCategoryExists)
        throw new BadRequestException('Sub category does not exists');
    }
    try {
      const expense = new this.expense({
        owner: userId,
        expense_category: payload.expense_category,
        amount: payload.amount,
        date: new Date(payload.date),
        comment: payload?.comment || null,
      });
      const result = await expense.save();
      return await result.populate('expense_category');
    } catch (e) {
      console.log(e);
    }
  }

  async getAllExpenses(payload: StatisticPayload) {
    const { userId, startDate, endDate } = payload;
    return await this.expense
      .find({ owner: userId, date: { $gte: startDate, $lte: endDate } })
      .sort({ date: -1 })
      .populate('expense_category')
      .exec();
  }

  async updateIncome(value: UpdateExpense) {
    const { userId, incomeId, date, expense_category, amount, comment } = value;
    const isIncomeExists = await this.getExpenseCategoryById(expense_category);
    if (!isIncomeExists)
      throw new BadRequestException("Expense category doesn't exists");
    const updated = await this.expense
      .findOneAndUpdate(
        {
          owner: userId,
          _id: incomeId,
        },
        {
          date,
          expense_category,
          amount,
          comment,
        },
        { new: true },
      )
      .populate('expense_category')
      .select('-owner -__v')
      .exec();
    if (!updated) throw new NotFoundException("Expense doesn't exists");
    return updated;
  }

  private async getExpenseCategoryById(id: string) {
    return this.expenseCategory.findById(id);
  }

  async getAllExpenseCategories(): Promise<ExpensesCategoriesDto[]> {
    return this.expenseCategory.aggregate([
      {
        $lookup: {
          from: 'expense_sub_category',
          let: { category_id: '$_id' },
          pipeline: [
            {
              $addFields: {
                expense_category: { $toObjectId: '$expense_category' },
              },
            },
            {
              $match: {
                $expr: { $eq: ['$expense_category', '$$category_id'] },
              },
            },
          ],
          as: 'sub_categories', // Alias for the joined data
        },
      },
    ]);
  }

  async getCategory(id: string) {
    try {
      return await this.expenseCategory.findById(id);
    } catch (e) {
      throw new BadRequestException(e.message());
    }
  }

  async getExpense(value: GetExpense): Promise<ExpenseAggregationResult[]> {
    const { userId, expenseCategoryId } = value;
    try {
      return await this.expense.aggregate([
        {
          $match: {
            owner: userId,
            expense_category: expenseCategoryId,
          },
        },
        {
          $addFields: {
            expense_category: { $toObjectId: '$expense_category' },
          },
        },
        {
          $lookup: {
            from: 'expense_category',
            localField: 'expense_category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails',
        },
        {
          $group: {
            _id: 'owner',
            totalAmount: { $sum: '$amount' },
            categoryName: { $first: '$categoryDetails.name' },
          },
        },
        {
          $project: {
            expense: '$categoryName',
            _id: 0,
            totalAmount: 1,
          },
        },
      ]);
    } catch (e) {
      throw new BadRequestException(e.message());
    }
  }

  async removeExpense(id: string) {
    return this.expense.findByIdAndDelete(id);
  }
}
