export interface IReturnStockData {
  returnId: number;
  returnDate: string;
  createdAt: string;
  employeeId: number;
  employeeUserName: string;
  employeeFullName: string;
  statusCode: number;
  statusDescription: string;
  loadId: number;
  loadDate: string;
  vehicleId: number;
  vehicleNumber: string;
  loadEmployeeId: number;
  loadEmployeeUserName: string;
  loadEmployeeFullName: string;
  route: {
    code: string;
    description: string;
  }[];
}
