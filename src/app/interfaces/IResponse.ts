export interface IResponse {
  headers: Record<string,string>;
  body: {
    message: string;
    status: string;
    content: any;
  };
  statusCode: string;
  statusCodeValue:number;
}
