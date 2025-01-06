import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IncomeCategory,
  IncomeCategorySchema,
} from '../incomes/schemas/IncomeCategory.schema';
import { Income, IncomeSchema } from '../incomes/schemas/Income.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../user/constants';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from '../expenses/schemas/ExpenseCategory.schema';
import { Expense, ExpenseSchema } from '../expenses/schemas/Expense.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: IncomeCategory.name, schema: IncomeCategorySchema },
      { name: Income.name, schema: IncomeSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100h' },
    }),
  ],
  providers: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
