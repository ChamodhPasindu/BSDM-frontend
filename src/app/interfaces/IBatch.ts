export interface IBatch {
  batchId?: number;
  batchCode: string;
  manufactureDate: string;
  expiryDate: string;
  usableDays: number;
  statusCode: number;
  warehouseLocation: string;
  // remainingQuantity: number;
  // createdAt: string;
  // createdBy: number;
}
