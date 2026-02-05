export interface IItemOrderData {
  itemId: number;
  itemName: string;
  totalQuantitySold: number;
  totalSalesAmount: number;
  minPrice: number;
  maxPrice: number;
  quantityLoaded: number;
  averageSalePrice: number;
  details: IOrder[];
}

export interface IOrder {
  orderId: number;
  salesMan: string;
  qtySale: number;
  sellingPrice: number;
  discount: number;
  customerName: string;
  shopName: string;
  routeName: string;
}
