export interface IDraftOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface IDraftOrder {
  id?: string; // UUID or unique identifier
  customerId?: number | null;
  routeId?: number | null;
  orderItems: IDraftOrderItem[];
  totalAmount: number;
  status: 'DRAFT'; // Always DRAFT until submitted
  createdAt?: Date;
  updatedAt?: Date;
}
