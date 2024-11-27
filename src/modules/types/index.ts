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
