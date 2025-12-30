export interface ISale {
  orderId: number;
  referenceNumber: string;
  itemDTOList: IOrderItem[];
}

export interface IOrderItem {
  productId: number;
  quantity: number;
  sellingPrice: number;
}
