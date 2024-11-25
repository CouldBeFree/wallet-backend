export class CreateExpenseCategoryResponseDto {
  _id: string;
  amount: number;
  expense_category: string;

  constructor(_id: string, amount: number, expense_category: string) {
    this._id = _id;
    this.amount = amount;
    this.expense_category = expense_category;
  }
}
