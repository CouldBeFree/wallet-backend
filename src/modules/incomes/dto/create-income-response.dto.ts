export class CreateIncomeResponseDto {
  _id: string;
  amount: number;
  income_category: string;

  constructor(_id: string, amount: number, income_category: string) {
    this._id = _id;
    this.amount = amount;
    this.income_category = income_category;
  }
}
