export interface IPaymentDetail {
  orderId: number;
  orderTotalAmount: number;
  orderPaidAmount: number;
  orderBalanceAmount: number;
  orderPaymentStatus: string;
  customerId: number;
  customerName: string;
  shopName: string;
  customerPhone: string;
  customerAddress: string;
  routeId: number;
  routeName: string;
  payments: IPaymentList[];
}

export interface IPaymentList {
  paymentId: number;
  orderReferenceNumber: string;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReason: string;
  paymentDate: string;
  paymentType: string;
}
