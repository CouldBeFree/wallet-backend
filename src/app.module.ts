import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { StatisticModule } from './modules/statistic/statistic.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    AuthModule,
    ExpensesModule,
    IncomesModule,
    StatisticModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
