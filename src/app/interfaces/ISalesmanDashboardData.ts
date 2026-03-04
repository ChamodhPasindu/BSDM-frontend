export interface ISummaryItem {
  time: string;
  count: number;
  valuesOfBills: number;
}

export interface IStockLoadValueSummary {
  minValue: number;
  maxValue: number;
}

export interface ISalesmanDashboardData {
  stockLoadValueSummary: IStockLoadValueSummary;
  billSummary: ISummaryItem[];
  pendingSummary: ISummaryItem[];
}
