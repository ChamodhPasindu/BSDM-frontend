export interface IPaymentSummary {
  orderReferenceNumber: string;
  customerName: string;
  customerShopName: string;
  orderDate: string;
  paymentStatus: string;
  needToPay: number;
  paidAmount: number;
  totalAmount: number;
  totalDiscount: number;
  items: Record<string, string>[];
  paymentDates:  Record<string, string>;
  orderStatus: string;
}
