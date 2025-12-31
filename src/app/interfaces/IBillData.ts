import { BillStatus } from "../enums/BillStatus.enum";

export interface IBillData {
  orderId: number;
  orderReferenceNumber: string;
  orderDate: string;
  paymentStatus: BillStatus;
  paymentDate: number;
  orderAmount: number;
  paidAmount: number;
  balanceAmount: number;
}
