export type CreateSubCategory = {
  expense_category: string;
  name: string;
  owner: string;
  expense_category_icon: string;
};

export type RemoveSubCategory = {
  owner: string;
  expense_sub_category: string;
};

export type UpdateSubCategory = {
  owner: string;
  name: string;
  expenseSubId: string;
  expense_category_icon: string;
};

export type GetSubCategories = {
  expense_category: string;
  owner: string;
};
