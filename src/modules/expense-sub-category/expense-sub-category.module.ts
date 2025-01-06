import { Module } from '@nestjs/common';
import { ExpenseSubCategoryController } from './expense-sub-category.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpenseSubCategory,
  ExpenseSubCategorySchema,
} from './schemas/ExpenseSubCategory.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../user/constants';
import { ExpenseSubCategoryService } from './expense-sub-category.service';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from '../expenses/schemas/ExpenseCategory.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: ExpenseSubCategory.name, schema: ExpenseSubCategorySchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100h' },
    }),
  ],
  controllers: [ExpenseSubCategoryController],
  providers: [ExpenseSubCategoryService],
})
export class ExpenseSubCategoryModule {}
