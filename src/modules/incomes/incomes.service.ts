import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncomeCategory } from './schemas/IncomeCategory.schema';
import { Model } from 'mongoose';
import { ExpensesCategoriesDto } from '../expenses/dto/expenses-categories.dto';
import { Income } from './schemas/Income.schema';
import { CreateExpenseCategoryDto } from '../expenses/dto/create-expense-category.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateIncomeResponseDto } from './dto/create-income-response.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(IncomeCategory.name)
    private incomeCategory: Model<IncomeCategory>,
    @InjectModel(Income.name) private income: Model<Income>,
  ) {}

  async createIncome(payload: CreateIncomeDto, userId: string) {
    const isIncomeExists = await this.getIncomeCategoryById(
      payload.income_category,
    );
    if (!isIncomeExists)
      throw new BadRequestException("Income category doesn't exists");
    try {
      const expense = new this.income({
        owner: userId,
        income_category: payload.income_category,
        amount: payload.amount,
        date: new Date(payload.date),
      });
      const result = await expense.save();
      const response = await result.populate('income_category');
      return new CreateIncomeResponseDto(
        response._id.toString(),
        response.amount,
        response.income_category,
      );
    } catch (e) {
      if (e.name === 'ValidationError') {
        const messages = Object.values(e.errors).map((err: any) => err.message);
        throw new BadRequestException(messages.join(', '));
      }
    }
  }

  private async getIncomeCategoryById(id: string) {
    return this.incomeCategory.findById(id);
  }

  async getAllExpenseCategories() {
    const document = await this.incomeCategory.find();
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
