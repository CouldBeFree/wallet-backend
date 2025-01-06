export type CreateSubCategory = {
  expense_category: string;
  name: string;
  owner: string;
};

export type RemoveSubCategory = {
  owner: string;
  expense_sub_category: string;
};

export type UpdateSubCategory = {
  owner: string;
  name: string;
  expenseSubId: string;
};

export type GetSubCategories = {
  expense_category: string;
  owner: string;
};
