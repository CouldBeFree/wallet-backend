import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../user/constants';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IncomeCategory,
  IncomeCategorySchema,
} from './schemas/IncomeCategory.schema';
import { Income, IncomeSchema } from './schemas/Income.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: IncomeCategory.name, schema: IncomeCategorySchema },
      { name: Income.name, schema: IncomeSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100h' },
    }),
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
