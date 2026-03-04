export interface IBatchData {
  batchId: number;
  batchCode: string;
  manufactureDate: string;
  expiryDate: string;
  usableDays: number;
  remainingQuantity: number;
  statusCode: string;
  statusDescription: string;
  warehouseLocation: string;
  createdAt: string;
  createdByUserId: number;
  createdByUserName: string;
  createdByFullName: string;
  totalProducts: number;
}
