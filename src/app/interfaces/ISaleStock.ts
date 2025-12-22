export interface ISaleStock {
  vehicleId: number;
  employeeId: number;
  routeId: number[];
  loadDate: string;
  statusCode:number;
  stockList: Record<string, number>[];
}
