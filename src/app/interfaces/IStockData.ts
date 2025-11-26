export interface IStockData {
  stockId: number;
  productId: number;
  productName: string;
  productNameId: number;
  totalQuantity: number;
  remainingQuantity: number;
  reason:string;
  lastUpdated: string;
  updatedByUserId: number;
  updatedByUserName: string;
  updatedByFullName: string;
}
