export interface IPaymentData {
  paymentId: number;
  orderReferenceNumber: string;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReason: string;
  paymentType: string;
  paymentDate: string;
  orderId: number;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
}
