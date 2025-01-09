import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExpenseSubCategory } from './schemas/ExpenseSubCategory.schema';
import { ExpenseCategory } from '../expenses/schemas/ExpenseCategory.schema';
import {
  CreateSubCategory,
  GetSubCategories,
  RemoveSubCategory,
  UpdateSubCategory,
} from './types';

@Injectable()
export class ExpenseSubCategoryService {
  constructor(
    @InjectModel(ExpenseSubCategory.name)
    private expenseSubCategory: Model<ExpenseSubCategory>,
    @InjectModel(ExpenseCategory.name)
    private expenseCategory: Model<ExpenseCategory>,
  ) {}

  async getCategory(id: string) {
    try {
      return await this.expenseCategory.findById(id);
    } catch (e) {
      throw new BadRequestException(e.message());
    }
  }

  private async getSubCategory(payload: CreateSubCategory) {
    const { expense_category, name, owner } = payload;
    return this.expenseSubCategory.findOne({
      $and: [
        { owner: owner },
        { expense_category: expense_category },
        { name: name },
      ],
    });
  }

  async createSubCategory(payload: CreateSubCategory) {
    const isExists = await this.getSubCategory(payload);
    if (isExists && !isExists.removed) {
      throw new BadRequestException('Sub category already exists');
    } else if (isExists && isExists.removed) {
      return this.expenseSubCategory.findByIdAndUpdate(
        isExists._id,
        {
          removed: false,
        },
        {
          new: true,
          returnDocument: 'after',
        },
      );
    }
    const { expense_category, name, owner, expense_category_icon } = payload;
    const isCategoryExists = await this.getCategory(expense_category);
    if (!isCategoryExists)
      throw new BadRequestException('Expense category does not exists');
    try {
      const expense = new this.expenseSubCategory({
        expense_category,
        name,
        owner,
        expense_category_icon: expense_category_icon || null,
      });
      return await expense.save();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async removeSubCategory(payload: RemoveSubCategory, remove: boolean) {
    const { owner, expense_sub_category } = payload;
    const result = await this.expenseSubCategory.findOneAndUpdate(
      {
        $and: [
          { owner: owner },
          { _id: new Types.ObjectId(expense_sub_category) },
        ],
      },
      {
        removed: true,
      },
    );

    if (!result) {
      throw new NotFoundException('Expense sub-category not found');
    }
    return true;
  }

  async updateSubCategory(payload: UpdateSubCategory) {
    const { owner, name, expenseSubId, expense_category_icon } = payload;
    const result = await this.expenseSubCategory
      .findOneAndUpdate(
        {
          _id: expenseSubId,
          owner,
        },
        {
          name,
          expense_category_icon,
        },
        { new: true },
      )
      .select('-owner -__v')
      .exec();

    if (!result) throw new NotFoundException("Sub category doesn't exists");
    return result;
  }

  async getSubCategories(value: GetSubCategories) {
    const { owner, expense_category } = value;
    return this.expenseSubCategory
      .find({
        $and: [{ owner }, { expense_category }, { removed: false }],
      })
      .populate('expense_category')
      .select('-owner -__v')
      .exec();
  }
}
