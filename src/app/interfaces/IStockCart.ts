import { IProductData } from './IProductData';

export interface IStockCart {
  product: IProductData;
  quantity: number;
  reason: string;
}
