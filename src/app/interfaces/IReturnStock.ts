export interface IReturnStock {
  loadId: number;
  employeeId: number;
  statusCode: number;
  returnDate: string;
  returnDetailsList: Record<string, number>[];
}
