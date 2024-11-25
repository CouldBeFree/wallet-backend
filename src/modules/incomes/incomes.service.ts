import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IncomeCategory } from './schemas/IncomeCategory.schema';
import { Model } from 'mongoose';
import { ExpensesCategoriesDto } from '../expenses/dto/expenses-categories.dto';
import { Income } from './schemas/Income.schema';
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        response.income_category.name,
      );
    } catch (e) {
      if (e.name === 'ValidationError') {
        const messages = Object.values(e.errors).map((err: any) => err.message);
        throw new BadRequestException(messages.join(', '));
      }
    }
  }

  async getAllIncomes(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const res = await this.income
      .find({ owner: userId })
      .skip(skip)
      .limit(pageSize)
      .populate('income_category')
      .exec();

    const total = await this.income.countDocuments({ owner: userId });
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

  async removeExpense(incomeId: string) {
    return this.income.findByIdAndDelete(incomeId);
  }
}
