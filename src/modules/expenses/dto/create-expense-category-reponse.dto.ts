export class CreateExpenseCategoryResponseDto {
  _id: string;
  amount: number;
  expense_category: string;
  comment: string | null;

  constructor(
    _id: string,
    amount: number,
    expense_category: string,
    comment: string | null,
  ) {
    this._id = _id;
    this.amount = amount;
    this.expense_category = expense_category;
    this.comment = comment;
  }
}
