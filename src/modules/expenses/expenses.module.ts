import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from './schemas/ExpenseCategory.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../user/constants';
import { Expense, ExpenseSchema } from './schemas/Expense.schema';
import {
  ExpenseSubCategory,
  ExpenseSubCategorySchema,
} from '../expense-sub-category/schemas/ExpenseSubCategory.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: ExpenseSubCategory.name, schema: ExpenseSubCategorySchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100h' },
    }),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
