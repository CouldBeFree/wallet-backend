export type StatisticPayload = {
  startDate: Date;
  endDate: Date;
  categoryId: string[] | null;
  page: number;
  pageSize: number;
  userId: string;
};

export type QueryParams = {
  startDate: Date;
  endDate: Date;
  categoryId: string[] | null;
  page: number;
  pageSize: number;
};

export type UpdateIncome = {
  userId: string;
  incomeId: string;
  income_category: string;
  amount: number;
  date: string;
};

export type UpdateExpense = {
  userId: string;
  incomeId: string;
  expense_category: string;
  amount: number;
  date: string;
  comment: string | null;
};

export type GetExpense = {
  userId: string;
  expenseCategoryId: string;
};
