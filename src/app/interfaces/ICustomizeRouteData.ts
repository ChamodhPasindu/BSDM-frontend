import { ICustomerData } from './ICustomerData';

export interface ICustomizeRouteData {
  routeId: number;
  routeName: string;
  routeDescription: string;
  expanded: boolean;
  customerList: Partial<ICustomerData>[];
}
