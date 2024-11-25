import { BadRequestException, Injectable } from '@nestjs/common';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseCategory } from './schemas/ExpenseCategory.schema';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { Expense } from './schemas/Expense.schema';

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
      });
      const result = await expense.save();
      return await result.populate('expense_category');
    } catch (e) {
      console.log(e);
    }
  }

  async getAllExpenses(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const res = await this.expense
      .find({ owner: userId })
      .skip(skip)
      .limit(pageSize)
      .populate('expense_category')
      .exec();

    const total = await this.expense.countDocuments({ owner: userId });
    return {
      data: res,
      metadata: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  private async getExpenseCategoryById(id: string) {
    return this.expenseCategory.findById(id);
    // try {
    //   return await this.expenseCategory.findById(id);
    // } catch (e) {
    //   console.log(e);
    // }
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
}
