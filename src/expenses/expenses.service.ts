import { Injectable } from '@nestjs/common';
import { ExpensesCategoriesDto } from './dto/expenses-categories.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseCategory } from './schemas/ExpenseCategory.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private expenseCategory: Model<ExpenseCategory>,
  ) {}

  async getAllExpenseCategories(): Promise<ExpensesCategoriesDto[]> {
    const y = await this.expenseCategory.find();
    const response = [];
    y.forEach((el) => {
      const categoryData = new ExpensesCategoriesDto(
        el._id.toString(),
        el.name,
      );
      response.push(categoryData);
    });
    return response;
  }
}
