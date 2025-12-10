import { IProductData } from './IProductData';
import { IVehicleData } from './IVehicleData';
import { IEmployeeData } from './IEmployeeData';
import { IRouteData } from './IRouteData';

export interface ISaleStockCart {
  product: IProductData;
  vehicle: IVehicleData;
  driver: IEmployeeData;
  routes: IRouteData[];
  quantity: number;
}
