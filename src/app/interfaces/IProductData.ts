export interface IProductData {
  productId: number;
  productName: string;
  nameId: number;
  quantity: number;
  minQuantity: number;
  currentQuantity: number;
  saleQuantity: number;
  totalAddedQuantity: number;
  description: string;
  price: number;
  minSalesPrice: number;
  createdAt: string;
  batchId: number;
  batchCode: string;
  manufactureDate: string;
  expiryDate: string;
  usableDays: number;
  remainingQuantity: number;
  statusCode: string;
  createdByUserId: 1;
  createdByUserName: string;
  createdByFullName: string;
  status: string;

  // salesman specific
  totalQuantity: number;
  soldQuantity: number;
  availableQuantity: number;
}
