export interface IOrderDetails {
  orderAmount: number;
  customerName: string;
  shopName: string;
  salesManName: string;
}

export interface IPaymentSummary {
  pendingCount: number;
  pendingAmount: number;
  partialCount: number;
  partialPaidAmount: number;
  partialBalanceAmount: number;
  fullCount: number;
  fullAmount: number;
}

export interface IPendingCard {
  biggestOrderToday?: IOrderDetails;
  biggestOrderWeek?: IOrderDetails;
  biggestOrderMonth?: IOrderDetails;
  biggestOrderYear?: IOrderDetails;
  pendingPaymentSummary?: IPaymentSummary;
}
