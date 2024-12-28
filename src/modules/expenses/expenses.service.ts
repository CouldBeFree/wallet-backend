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
import { StatisticPayload, UpdateExpense } from '../types';

@Injectable()
export class ExpensesService {
  constructor(
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
    const document = await this.expenseCategory.find();
    const response = [];
    document.forEach((el) => {
      const categoryData = new ExpensesCategoriesDto(
        el._id.toString(),
        el.name,
      );
      response.push(categoryData);
    });
    return response;
  }

  async removeExpense(id: string) {
    return this.expense.findByIdAndDelete(id);
  }
}
