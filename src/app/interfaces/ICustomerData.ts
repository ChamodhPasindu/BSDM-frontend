export interface ICustomerData {
  customerId: number;
  routeId: number;
  routeName: string;
  customerName: string;
  phone:number;
  shopName: string;
  address: string;
  statusCode: number;
  statusDescription: string;
  addedDate: string;
  createdByUserId: number;
  createdByUserName: string;
  createdByFullName: string;

  // salesman specific 
  overdue:number;
}
