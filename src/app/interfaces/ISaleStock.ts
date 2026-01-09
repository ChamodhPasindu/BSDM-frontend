export interface ISaleStock {
  vehicleId: number;
  employeeId: number;
  routeId: number[];
  loadDate: string;
  stockList: Record<string, number>[];
}
