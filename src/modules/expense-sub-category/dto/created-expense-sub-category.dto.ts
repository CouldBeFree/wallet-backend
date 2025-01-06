export class CreatedExpenseSubCategoryDto {
  _id: string;
  name: string;
  expense_category: string;

  constructor(_id: string, name: string, expense_category: string) {
    this._id = _id;
    this.name = name;
    this.expense_category = expense_category;
  }
}
