export interface ISaleStockData {
  loadId: number;
  vehicleId: number;
  vehicleNumber: string;
  employeeId: number;
  employeeUserName: number;
  employeeFullName: number;
  route: {
    code: string;
    description: string;
  }[];
  routeIds: number[];
  routeNames: number[];
  loadDate: number;
  statusCode: number;
  statusDescription: number;
  createdAt: number;
}
